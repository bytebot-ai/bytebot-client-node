import { BytebotClient as BytebotApiClient } from "../Client";
import * as environments from "../environments";
import * as core from "../core";
import { CrossEnvConfig } from "@flatfile/cross-env-config";
import { Page } from "puppeteer";
import * as Bytebot from "../api";
import { click, extractTable, copyText, assignAttribute, copyAttribute } from "./ActionFunctions";
import { BytebotInvalidActionError } from "./types/actionErrors";

export declare namespace BytebotClient {
    interface ClientOptions {
        environment?: core.Supplier<environments.BytebotEnvironment | string>;
        token?: core.Supplier<string>;
    }

    export interface PromptOptions {
        executeActions?: boolean;
        parameters?: { [key: string]: any }; // To pass sensitive information securely
    }
}

export class BytebotClient {
    protected _bytebotApiClient: BytebotApiClient;

    constructor(options: BytebotClient.ClientOptions = {}) {
        this._bytebotApiClient = new BytebotApiClient({
            environment: options.environment ?? environmentSupplier,
            apiKey: options.token ?? tokenSupplier,
        });
    }

    /**
     * Translate a natural language prompt into a series of actions, and execute them.
     * The result of each action is stored in the action object.
     * @param prompt The list of actions to execute
     * @param page The page to execute the actions on
     * @param options Addtional options for prompting
     * @returns void
     */
    public async prompt(
        prompt: string,
        page: Page,
        options: BytebotClient.PromptOptions = { executeActions: true }
    ): Promise<Bytebot.ActionDetail[]> {
        const html = await page.content();
        const url = page.url();
        const actions =
            (
                await this._bytebotApiClient.actions.generateActions({
                    url,
                    html,
                    prompt,
                })
            ).actions ?? [];

        // Resolve any sensitive parameters
        if (options.parameters) {
            for (const action of actions) {
                this.resolveParameters(action, options.parameters);
            }
        }

        if (options.executeActions) {
            await this.execute(actions, page);
        }
        return actions;
    }

    private resolveParameters(action: Bytebot.ActionDetail, parameters: { [key: string]: any }): void {
        function isAssignAttributeParameters(params: any): params is Bytebot.ActionDetailParameters.AssignAttribute {
            return params?.actionType === "AssignAttribute";
        }

        const actionParameters = action.parameters;

        if (isAssignAttributeParameters(actionParameters)) {
            // Logic to securely resolve parameter references to their actual values
            Object.keys(parameters).forEach((key) => {
                // Resolve the parameter reference to its actual value
                // Example: parameters[key] might be replaced with a secure lookup of the actual value
                actionParameters.value = actionParameters.value.replace(`${key}`, parameters[key]);
            });
        }

        // Assign the resolved parameters back to the action
        action.parameters = actionParameters;
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
        const tasks = actions.map((action) => () => this.processActionOption(action, page));

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
                throw new BytebotInvalidActionError(actionOption.actionType);
        }
    }

    /** Turn an array of promises into a promise of an array. The promises are executed sequentially, NOT in parallel like Promise.all*/
    private async concatenateFunctions<T>(functions: (() => Promise<T>)[]): Promise<T[]> {
        if (functions.length === 0) {
            return Promise.resolve([]);
        }
        if (functions.length === 1) {
            return functions[0]().then((res) => [res]);
        }
        const [first, ...rest] = functions;
        return first().then((res_1) => this.concatenateFunctions(rest).then((res2) => [res_1, ...res2]));
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
