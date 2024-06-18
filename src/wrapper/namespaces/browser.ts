import { BytebotClient as BytebotApiClient } from "../../Client";
import * as Bytebot from "../../api";

export declare namespace BytebotBrowser {
  export interface BrowserActOptions {
    sessionId: string;
    prompt: string;
    url?: string;
    pageId?: string;
  }

  export interface BrowserExtractOptions {
    sessionId: string;
    schema: Bytebot.ExtractSchema;
    url?: string;
    pageId?: string;
  }
}

export class BytebotBrowser {
  protected _bytebotApiClient: BytebotApiClient;

  constructor(client: BytebotApiClient) {
    this._bytebotApiClient = client;
  }

  public async startSession(url: string): Promise<Bytebot.BrowserOpenResponse> {
    return this._bytebotApiClient.browsers.open({ url });
  }

  public async endSession(
    sessionId: string
  ): Promise<Bytebot.BrowserCloseResponse> {
    return this._bytebotApiClient.browsers.close({ sessionId });
  }

  public async act({
    sessionId,
    prompt,
    url,
    pageId,
  }: BytebotBrowser.BrowserActOptions): Promise<Bytebot.BrowserActResponse> {
    const response = await this._bytebotApiClient.browsers.act({
      sessionId,
      prompt,
      ...(url ? { url } : {}),
      ...(pageId ? { pageId } : {}),
    });

    if (response.error) {
      throw response.error;
    }

    return response;
  }

  public async extract({
    sessionId,
    schema,
    url,
    pageId,
  }: BytebotBrowser.BrowserExtractOptions): Promise<Bytebot.BrowserExtractResponse> {
    const response = await this._bytebotApiClient.browsers.extract({
      sessionId,
      schema: JSON.stringify(schema, null, 2),
      ...(url ? { url } : {}),
      ...(pageId ? { pageId } : {}),
    });

    if (response.error) {
      throw response.error;
    }

    return response;
  }

  public async status(
    sessionId: string
  ): Promise<Bytebot.BrowserStatusResponse> {
    return this._bytebotApiClient.browsers.status(sessionId);
  }
}
