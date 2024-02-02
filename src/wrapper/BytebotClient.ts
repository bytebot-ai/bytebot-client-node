import { BytebotClient as BytebotApiClient } from "../Client";
import * as environments from "../environments";
import * as core from "../core";
import { CrossEnvConfig } from "@flatfile/cross-env-config";
import { Page } from "puppeteer";
import  * as Bytebot from "../api";
import {
  click,
  extractTable,
  copyText,
  assignAttribute,
  copyAttribute,
} from "./ActionFunctions";

export declare namespace BytebotClient {
  interface Options {
    environment?: core.Supplier<environments.BytebotEnvironment | string>;
    token?: core.Supplier<string>;
  }
}

export class BytebotClient {
  protected _bytebotApiClient: BytebotApiClient;

  constructor(options: BytebotClient.Options = {}) {
    this._bytebotApiClient = new BytebotApiClient({
      environment: options.environment ?? environmentSupplier,
      apiKey: options.token ?? tokenSupplier,
    });
  }

  public async prompt(prompt: string, page: Page) {
    const html = await page.content();
    const url = page.url();
    return (
      await this._bytebotApiClient.actions.generateActions({
        url,
        html,
        prompt,
      })
    ).actions;
  }

  /**
   * Execute a list of actions on a page and modify the actions in place.
   * The result of each action is stored in the action object.
   * @param actions The list of actions to execute
   * @param page The page to execute the actions on
   * @returns void
   */
  public async execute(actions: Bytebot.ActionDetail[], page: Page): Promise<void> {
    // Create a task for each action, wrapping the result in an object
    const tasks = actions.map(
      (action) => () => this.processActionOption(action, page)
    );

    // Execute the tasks sequentially
    await this.concatenateFunctions(tasks).then((res) => {
      actions.forEach((action, index) => {
        action.result = res[index];
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
        throw new Error(`Action type ${actionOption.actionType} not supported`);
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

const environmentSupplier = () => {
  const url = CrossEnvConfig.get("BYTEBOT_API_URL");
  if (!url) {
    return environments.BytebotEnvironment.Default;
  }
  return url;
};

const tokenSupplier = () => {
  const token = CrossEnvConfig.get("BYTEBOT_API_KEY");
  if (token == undefined) {
    throw new Error("BYTEBOT_API_KEY is not undefined");
  }
  return token;
};
