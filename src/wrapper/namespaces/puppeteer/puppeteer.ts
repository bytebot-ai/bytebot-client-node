import { Logger } from "../../Logger";
import { BytebotClient as BytebotApiClient } from "../../../Client";
import * as Bytebot from "../../../api";
import {
  click,
  extractTable,
  copyText,
  assignAttribute,
  copyAttribute,
} from "./ActionFunctions";
import { BytebotGenerationError } from "../../errors";
import { createId } from "@paralleldrive/cuid2";
import { rrwebScript } from "./rrwebScript";
declare global {
  interface Window {
    rrwebSnapshot: {
      snapshot: (options?: any) => any;
    };
  }
}

const PUPPETEER_ACT_TIMEOUT = 5000;

export declare namespace BytebotPuppeteer {
  export interface PromptOptions {
    parameters?: { [key: string]: any }; // To pass sensitive information securely
  }

  export interface PuppeteerActOptions {
    sessionId?: string;
    prompt: string;
    formValues?: Bytebot.FormValue[];
    page: any;
    options?: BytebotPuppeteer.PromptOptions;
  }

  export interface PuppeteerExtractOptions {
    sessionId?: string;
    schema: Bytebot.ExtractSchema;
    page: any;
  }

  export interface PuppeteerExecuteOptions {
    actions: Bytebot.ActResponseActionsItem[] | [Bytebot.ExtractResponseAction];
    page: any;
  }
}

export class BytebotPuppeteer {
  protected _bytebotApiClient: BytebotApiClient;
  protected logger: Logger;
  protected sessionId: string | null = null;

  constructor(client: BytebotApiClient, logger: Logger) {
    this._bytebotApiClient = client;
    this.logger = logger;
  }

  public startSession(): void {
    this.sessionId = createId();
    this.logger.info("Starting session: " + this.sessionId);
  }

  public endSession(): void {
    this.logger.info("Ending session: " + this.sessionId);
    this.sessionId = null;
  }

  private async getPageData(page: any): Promise<{ url: string; html: string }> {
    // Bypass CSP for the page
    await page.setBypassCSP(true);

    const url = page.url();

    const scriptId = "rrweb-snapshot";

    const scriptExists = await page.evaluate((scriptId: any) => {
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

  public async act({
    sessionId,
    prompt,
    formValues,
    page,
    options,
  }: BytebotPuppeteer.PuppeteerActOptions): Promise<
    Bytebot.ActResponseActionsItem[]
  > {
    const { url, html } = await this.getPageData(page);
    this.logger.info("Generating actions");

    const response = await this._bytebotApiClient.requests.act({
      sessionId: sessionId ?? this.sessionId ?? undefined,
      url,
      html,
      prompt,
      formValues,
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

  public async extract({
    sessionId,
    schema,
    page,
  }: BytebotPuppeteer.PuppeteerExtractOptions): Promise<
    [Bytebot.ExtractResponseAction] | []
  > {
    const { url, html } = await this.getPageData(page);
    this.logger.info("Generating actions");

    const response = await this._bytebotApiClient.requests.extract({
      sessionId: sessionId ?? this.sessionId ?? undefined,
      url,
      html,
      schema: JSON.stringify(schema, null, 2),
    });

    const actions: [Bytebot.ExtractResponseAction] | [] = response.action
      ? [response.action]
      : [];
    return actions;
  }

  public async execute({
    actions,
    page,
  }: BytebotPuppeteer.PuppeteerExecuteOptions): Promise<
    null | string | { [key: string]: string | null }[]
  > {
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

        // After "act" actions, wait for the network to be idle
        await page.waitForNetworkIdle({ timeout: PUPPETEER_ACT_TIMEOUT });
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
