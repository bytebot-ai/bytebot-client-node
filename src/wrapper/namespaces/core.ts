import { BytebotGenerationError } from "../errors";
import { BytebotClient as BytebotApiClient } from "../../Client";
import * as Bytebot from "../../api";
import { Logger } from "../Logger";
import { createId } from "@paralleldrive/cuid2";

export declare namespace BytebotCore {
  export interface PageData {
    url: string;
    html: string;
  }

  export interface PromptOptions {
    parameters?: { [key: string]: any }; // To pass sensitive information securely
  }

  export interface CoreActOptions {
    sessionId?: string;
    prompt: string;
    formValues?: Bytebot.FormValue[];
    page: BytebotCore.PageData;
    options?: BytebotCore.PromptOptions;
  }

  export interface CoreExtractOptions {
    sessionId?: string;
    schema: Bytebot.ExtractSchema;
    page: BytebotCore.PageData;
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
    sessionId,
    prompt,
    formValues,
    page,
    options,
  }: BytebotCore.CoreActOptions): Promise<Bytebot.ActResponseActionsItem[]> {
    const { url, html } = page;
    this.logger.info("Generating actions");

    const response = await this._bytebotApiClient.requests.act({
      sessionId: sessionId ?? this.sessionId ?? undefined,
      url,
      html,
      prompt,
      formValues: formValues ?? [],
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
  }: BytebotCore.CoreExtractOptions): Promise<
    [Bytebot.ExtractResponseAction] | []
  > {
    const { url, html } = page;
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
