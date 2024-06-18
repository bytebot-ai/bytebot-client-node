import { BytebotGenerationError } from "../errors";
import { BytebotClient as BytebotApiClient } from "../../Client";
import * as Bytebot from "../../api";
import { Logger } from "../Logger";
import { createId } from "@paralleldrive/cuid2";
import e from "express";

export declare namespace BytebotCore {
  export interface PageData {
    url: string;
    html: string;
  }

  export interface PromptOptions {
    useCache?: boolean;
    parameters?: { [key: string]: any }; // To pass sensitive information securely
  }

  export interface CoreActOptions {
    prompt: string;
    page: BytebotCore.PageData;
    options?: BytebotCore.PromptOptions;
  }

  export interface CoreExtractOptions {
    schema: Bytebot.ExtractSchema;
    page: BytebotCore.PageData;
    options?: BytebotCore.PromptOptions;
  }
}

export class BytebotCore {
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

  public async act({
    prompt,
    page,
    options,
  }: BytebotCore.CoreActOptions): Promise<Bytebot.ActResponseActionsItem[]> {
    const { url, html } = page;
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

  public async extract({
    schema,
    page,
    options,
  }: BytebotCore.CoreExtractOptions): Promise<
    [Bytebot.ExtractResponseAction] | []
  > {
    const { url, html } = page;
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
