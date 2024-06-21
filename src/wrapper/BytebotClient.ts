import { BytebotClient as BytebotApiClient } from "../Client";
import * as environments from "../environments";
import * as core from "../core";
import { Logger } from "./Logger";
import { BytebotCore } from "./namespaces/core";
import { BytebotBrowser } from "./namespaces/browser";
import { BytebotPuppeteer } from "./namespaces/puppeteer/puppeteer";
import { BytebotPlaywright } from "./namespaces/playwright/playwright";

export declare namespace BytebotClient {
  interface ClientOptions {
    apiUrl?: core.Supplier<environments.BytebotEnvironment | string>;
    apiKey?: core.Supplier<string>;
    logVerbose?: boolean;
  }
}

export class BytebotClient {
  protected _bytebotApiClient: BytebotApiClient;
  protected logger: Logger;

  public core: BytebotCore;
  public browser: BytebotBrowser;
  public puppeteer: BytebotPuppeteer;
  public playwright: BytebotPlaywright;

  constructor(options: BytebotClient.ClientOptions = { logVerbose: false }) {
    this._bytebotApiClient = new BytebotApiClient({
      environment: options.apiUrl ?? apiUrlSupplier,
      apiKey: options.apiKey ?? apiKeySupplier,
    });

    this.logger = new Logger({
      logToConsole: true,
      verbose: options.logVerbose,
    });

    this.core = new BytebotCore(this._bytebotApiClient, this.logger);
    this.browser = new BytebotBrowser(this._bytebotApiClient);
    this.puppeteer = new BytebotPuppeteer(this._bytebotApiClient, this.logger);
    this.playwright = new BytebotPlaywright(this._bytebotApiClient, this.logger);
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
    throw new Error("BYTEBOT_API_KEY is not defined");
  }
  return token;
};
