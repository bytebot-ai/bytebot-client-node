import { BytebotClient as BytebotApiClient } from "../Client";
import * as environments from "../environments";
import * as core from "../core";
import { CrossEnvConfig } from "@flatfile/cross-env-config";
import { Page } from "puppeteer";
import * as Bytebot from "../api";
import {
  click,
  extractTable,
  copyText,
  assignAttribute,
  copyAttribute,
} from "./ActionFunctions";
import { BytebotGenerationError } from "./types/actionErrors";
import { Logger } from "./Logger";

export declare namespace BytebotClient {
  interface ClientOptions {
    apiUrl?: core.Supplier<environments.BytebotEnvironment | string>;
    apiKey?: core.Supplier<string>;
    logVerbose?: boolean;
  }

  export interface PromptOptions {
    executeActions?: boolean;
    parameters?: { [key: string]: any }; // To pass sensitive information securely
  }
}

export class BytebotClient {
  protected _bytebotApiClient: BytebotApiClient;
  protected logger: Logger;
  protected batchId: string | null = null;
  constructor(options: BytebotClient.ClientOptions = { logVerbose: false }) {
    this._bytebotApiClient = new BytebotApiClient({
      environment: options.apiUrl ?? apiUrlSupplier,
      apiKey: options.apiKey ?? apiKeySupplier,
    });

    this.logger = new Logger({
      logToConsole: true,
      verbose: options.logVerbose,
    });
  }

  public setBatchId(batchId: string): void {
    this.batchId = batchId;
  }

  /**
   * Translate a natural language prompt into a series of actions, and execute them.
   * The result of each action is stored in the action object.
   * @param prompt The description of the actions to execute
   * @param page The page to execute the actions on
   * @param options Addtional options for prompting
   * @returns A list of the action objects
   */
  public async prompt(
    prompt: string,
    page: Page,
    options: BytebotClient.PromptOptions = { executeActions: true }
  ): Promise<Bytebot.ActionDetail[]> {
    const html = await page.content();
    const url = page.url();
    this.logger.info("Generating actions");

    const response = await this._bytebotApiClient.sessions.create({
      url,
      html,
      prompt,
      // include the batchId if it is set
      ...(this.batchId ? { batchId: this.batchId } : {}),
    });

    if (response.error) {
      throw new BytebotGenerationError(response.error);
    }

    const actions = response.actions ?? [];
    this.logger.info(
      `Generated ${actions.length} action${actions.length > 1 ? "s" : ""}`
    );

    // Resolve any sensitive parameters
    if (options.parameters) {
      for (const action of actions) {
        this.resolveParameters(action, options.parameters);
      }
    }

    if (options.executeActions) {
      return await this.execute(actions, page);
    }
    return actions;
  }

  private resolveParameters(
    action: Bytebot.ActionDetail,
    parameters: { [key: string]: any }
  ): void {
    if (action.actionType !== "AssignAttribute") {
      // Only AssignAttribute action type has parameters
      return;
    }

    Object.keys(parameters).forEach((key) => {
      // Resolve the parameter reference to its actual value
      action.value = action.value.replace(`${key}`, parameters[key]);
    });
  }

  /**
   * Execute a list of actions on a page and modify the actions in place.
   * The result of each action is stored in the action object.
   * @param actions The list of actions to execute
   * @param page The page to execute the actions on
   * @returns A copy of the actions with the result property set to the result of the action
   */
  public async execute(
    actions: Bytebot.ActionDetail[],
    page: Page
  ): Promise<Bytebot.ActionDetail[]> {
    this.logger.info(
      `Executing ${actions.length} action${actions.length > 1 ? "s" : ""}`
    );
    // Create a task for each action, wrapping the result in an object
    const tasks = actions.map(
      (action) => () => this.processActionOption(action, page)
    );

    // Execute the tasks sequentially
    return await this.concatenateFunctions(tasks).then((res) => {
      this.logger.info(
        `Actions executed. Received ${res.length} result${
          res.length > 1 ? "s" : ""
        }`
      );
      return actions.map((action, index) => {
        const deepCopy = JSON.parse(
          JSON.stringify(action)
        ) as Bytebot.ActionDetail;
        deepCopy.result = res[index];
        return deepCopy;
      });
    });
  }

  // ***********************
  // *** Private methods ***
  // ***********************

  /** Process one action. Call the appropriate action function from ActionFunctions */
  private async processActionOption(
    actionOption: Bytebot.ActionDetail,
    page: Page
  ): Promise<Bytebot.ActionDetailResult> {
    switch (actionOption.actionType) {
      case "AssignAttribute":
        return assignAttribute(actionOption, page);
      case "CopyAttribute":
        return copyAttribute(actionOption, page);
      case "CopyText":
        return copyText(actionOption, page);
      case "Click":
        return click(actionOption, page);
      case "ExtractTable":
        return extractTable(actionOption, page);
      default:
        throw new Error("List of actions should be exhaustive");
    }
  }

  /** Turn an array of promises into a promise of an array. The promises are executed sequentially, NOT in parallel like Promise.all*/
  private async concatenateFunctions<T>(
    functions: (() => Promise<T>)[]
  ): Promise<T[]> {
    if (functions.length === 0) {
      return Promise.resolve([]);
    }
    if (functions.length === 1) {
      return functions[0]().then((res) => [res]);
    }
    const [first, ...rest] = functions;
    return first().then((res_1) =>
      this.concatenateFunctions(rest).then((res2) => [res_1, ...res2])
    );
  }
}

const apiUrlSupplier = () => {
  const url = CrossEnvConfig.get("BYTEBOT_API_URL");
  if (!url) {
    return environments.BytebotEnvironment.Default;
  }
  return url;
};

const apiKeySupplier = () => {
  const token = CrossEnvConfig.get("BYTEBOT_API_KEY");
  if (token == undefined) {
    throw new Error("BYTEBOT_API_KEY is not undefined");
  }
  return token;
};
