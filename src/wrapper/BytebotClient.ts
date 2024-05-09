import { BytebotClient as BytebotApiClient } from "../Client";
import * as environments from "../environments";
import * as core from "../core";
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
import { createId } from "@paralleldrive/cuid2";
import { rrwebScript } from "./rrwebScript";

declare global {
  interface Window {
    rrwebSnapshot: {
      // Assuming `snapshot` is a method you use from rrweb-snapshot
      // Adjust the method signature according to your actual usage
      snapshot: (options?: any) => any;
    };
  }
}

export declare namespace BytebotClient {
  interface ClientOptions {
    apiUrl?: core.Supplier<environments.BytebotEnvironment | string>;
    apiKey?: core.Supplier<string>;
    logVerbose?: boolean;
  }

  export interface PromptOptions {
    useCache?: boolean;
    parameters?: { [key: string]: any }; // To pass sensitive information securely
  }
}

export class BytebotClient {
  protected _bytebotApiClient: BytebotApiClient;
  protected logger: Logger;
  protected sessionId: string | null = null;
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

  public startSession(): void {
    this.sessionId = createId();
    this.logger.info("Starting session: " + this.sessionId);
  }

  public endSession(): void {
    this.logger.info("Ending session: " + this.sessionId);
    this.sessionId = null;
  }

  private async getPageData(
    page: Page
  ): Promise<{ url: string; html: string }> {
    const url = page.url();

    const scriptId = "rrweb-snapshot";

    const scriptExists = await page.evaluate((scriptId) => {
      return !!document.getElementById(scriptId);
    }, scriptId);

    if (!scriptExists) {
      // Inject the rrweb script directly from a string
      await page.addScriptTag({
        content: rrwebScript,
        id: scriptId,
      });
    }

    // Wait for the script to load and initialize
    await page.waitForFunction(() => !!window.rrwebSnapshot);

    const snapshot = await page.evaluate(() => {
      const snapshotData = window.rrwebSnapshot.snapshot(document);
      return snapshotData;
    });

    return { url, html: JSON.stringify(snapshot) };
  }

  public async act(
    prompt: string,
    page: Page,
    options?: BytebotClient.PromptOptions
  ): Promise<Bytebot.ActResponseActionsItem[]> {
    const { url, html } = await this.getPageData(page);
    this.logger.info("Generating actions");

    const response = await this._bytebotApiClient.requests.act({
      url,
      html,
      prompt,
      ...(options?.useCache ? { useCache: options.useCache } : {}),
      // include the sessionId if it is set
      ...(this.sessionId ? { sessionId: this.sessionId } : {}),
    });

    if (response.error) {
      throw new BytebotGenerationError(response.error);
    }

    const actions = response.actions ?? [];
    this.logger.info(
      `Generated ${actions.length} action${actions.length > 1 ? "s" : ""}`
    );

    // Resolve any sensitive parameters
    if (options?.parameters) {
      for (const action of actions) {
        this.resolveParameters(action, options.parameters);
      }
    }

    return actions;
  }

  public async extract(
    schema: Bytebot.ExtractSchema,
    page: Page,
    options?: BytebotClient.PromptOptions
  ): Promise<[Bytebot.ExtractResponseAction] | []> {
    const { url, html } = await this.getPageData(page);
    this.logger.info("Generating actions");

    const response = await this._bytebotApiClient.requests.extract({
      url,
      html,
      schema: JSON.stringify(schema, null, 2),
      ...(options?.useCache ? { useCache: options.useCache } : {}),
      // include the sessionId if it is set
      ...(this.sessionId ? { batchId: this.sessionId } : {}),
    });

    const actions: [Bytebot.ExtractResponseAction] | [] = response.action
      ? [response.action]
      : [];
    return actions;
  }

  public async execute(
    actions: Bytebot.ActResponseActionsItem[] | [Bytebot.ExtractResponseAction],
    page: Page
  ): Promise<null | string | { [key: string]: string | null }[]> {
    this.logger.info(
      `Executing ${actions.length} action${actions.length > 1 ? "s" : ""}`
    );

    if (this.isActResponseActionsItemArray(actions)) {
      for (const action of actions as Bytebot.ActResponseActionsItem[]) {
        if (action.type == Bytebot.BrowserActionType.Click) {
          await click(action, page);
        } else if (action.type == Bytebot.BrowserActionType.AssignAttribute) {
          await assignAttribute(action, page);
        }
      }
    } else if (this.isExtractResponseActionArray(actions)) {
      const action = actions[0];
      if (action.type == Bytebot.BrowserActionType.CopyText) {
        return await copyText(action, page);
      } else if (action.type == Bytebot.BrowserActionType.CopyAttribute) {
        return await copyAttribute(action, page);
      } else if (action.type == Bytebot.BrowserActionType.ExtractTable) {
        return await extractTable(action, page);
      }
    }

    return null as any;
  }

  // ***********************
  // *** Private methods ***
  // ***********************

  private isActResponseActionsItemArray(
    actions: any[]
  ): actions is Bytebot.ActResponseActionsItem[] {
    if (actions.length === 0) {
      return false;
    }

    return (
      actions[0].type == Bytebot.BrowserActionType.Click ||
      actions[0].type == Bytebot.BrowserActionType.AssignAttribute
    );
  }

  private isExtractResponseActionArray(
    actions: any[]
  ): actions is [Bytebot.ExtractResponseAction] {
    if (actions.length != 1) {
      return false;
    }

    return (
      actions[0].type == Bytebot.BrowserActionType.ExtractTable ||
      actions[0].type == Bytebot.BrowserActionType.CopyText ||
      actions[0].type == Bytebot.BrowserActionType.CopyAttribute
    );
  }

  private resolveParameters(
    action: Bytebot.ActResponseActionsItem,
    parameters: { [key: string]: any }
  ): void {
    if (action.type !== Bytebot.BrowserActionType.AssignAttribute) {
      // Only AssignAttribute action type has parameters
      return;
    }

    Object.keys(parameters).forEach((key) => {
      // Resolve the parameter reference to its actual value
      action.value = action.value.replace(`${key}`, parameters[key]);
    });
  }
}

const apiUrlSupplier = () => {
  const url = process.env.BYTEBOT_API_URL;
  if (!url) {
    return environments.BytebotEnvironment.Default;
  }
  return url;
};

const apiKeySupplier = () => {
  const token = process.env.BYTEBOT_API_KEY;
  if (token == undefined) {
    throw new Error("BYTEBOT_API_KEY is not undefined");
  }
  return token;
};
