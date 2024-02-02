/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as Bytebot from "../../..";
import urlJoin from "url-join";
import * as errors from "../../../../errors";

export declare namespace Actions {
    interface Options {
        environment?: core.Supplier<environments.BytebotEnvironment | string>;
        apiKey: core.Supplier<string>;
    }

    interface RequestOptions {
        timeoutInSeconds?: number;
        maxRetries?: number;
    }
}

export class Actions {
    constructor(protected readonly _options: Actions.Options) {}

    /**
     * @throws {@link Bytebot.BadRequestError}
     *
     * @example
     *     await bytebot.actions.generateActions({
     *         url: "string",
     *         html: "string",
     *         prompt: "string"
     *     })
     */
    public async generateActions(
        request: Bytebot.ActionRequest,
        requestOptions?: Actions.RequestOptions
    ): Promise<Bytebot.ActionResponse> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.BytebotEnvironment.Default,
                "v1/generate-actions"
            ),
            method: "POST",
            headers: {
                "X-API-KEY": await core.Supplier.get(this._options.apiKey),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@bytebot/sdk",
                "X-Fern-SDK-Version": "0.0.18",
            },
            contentType: "application/json",
            body: request,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body as Bytebot.ActionResponse;
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 400:
                    throw new Bytebot.BadRequestError(_response.error.body as unknown);
                default:
                    throw new errors.BytebotError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.BytebotError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.BytebotTimeoutError();
            case "unknown":
                throw new errors.BytebotError({
                    message: _response.error.errorMessage,
                });
        }
    }
}
