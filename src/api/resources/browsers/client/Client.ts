/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as Bytebot from "../../..";
import urlJoin from "url-join";
import * as errors from "../../../../errors";

export declare namespace Browsers {
    interface Options {
        environment?: core.Supplier<environments.BytebotEnvironment | string>;
        apiKey: core.Supplier<string>;
    }

    interface RequestOptions {
        timeoutInSeconds?: number;
        maxRetries?: number;
    }
}

export class Browsers {
    constructor(protected readonly _options: Browsers.Options) {}

    /**
     * @throws {@link Bytebot.BadRequestError}
     *
     * @example
     *     await bytebot.browsers.open({
     *         url: "url"
     *     })
     */
    public async open(
        request: Bytebot.BrowserOpenRequest,
        requestOptions?: Browsers.RequestOptions
    ): Promise<Bytebot.BrowserOpenResponse> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.BytebotEnvironment.Default,
                "browsers/open"
            ),
            method: "POST",
            headers: {
                "X-API-KEY": await core.Supplier.get(this._options.apiKey),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@bytebot/sdk",
                "X-Fern-SDK-Version": "0.4.2",
            },
            contentType: "application/json",
            body: request,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 120000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body as Bytebot.BrowserOpenResponse;
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

    /**
     * @throws {@link Bytebot.BadRequestError}
     *
     * @example
     *     await bytebot.browsers.close({
     *         sessionId: "sessionId"
     *     })
     */
    public async close(
        request: Bytebot.BrowserCloseRequest,
        requestOptions?: Browsers.RequestOptions
    ): Promise<Bytebot.BrowserCloseResponse> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.BytebotEnvironment.Default,
                "browsers/close"
            ),
            method: "POST",
            headers: {
                "X-API-KEY": await core.Supplier.get(this._options.apiKey),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@bytebot/sdk",
                "X-Fern-SDK-Version": "0.4.2",
            },
            contentType: "application/json",
            body: request,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 120000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body as Bytebot.BrowserCloseResponse;
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

    /**
     * @throws {@link Bytebot.BadRequestError}
     *
     * @example
     *     await bytebot.browsers.act({
     *         prompt: "prompt",
     *         sessionId: "sessionId"
     *     })
     */
    public async act(
        request: Bytebot.BrowserActRequest,
        requestOptions?: Browsers.RequestOptions
    ): Promise<Bytebot.BrowserActResponse> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.BytebotEnvironment.Default,
                "browsers/act"
            ),
            method: "POST",
            headers: {
                "X-API-KEY": await core.Supplier.get(this._options.apiKey),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@bytebot/sdk",
                "X-Fern-SDK-Version": "0.4.2",
            },
            contentType: "application/json",
            body: request,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 120000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body as Bytebot.BrowserActResponse;
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

    /**
     * @throws {@link Bytebot.BadRequestError}
     *
     * @example
     *     await bytebot.browsers.extract({
     *         schema: "schema",
     *         sessionId: "sessionId"
     *     })
     */
    public async extract(
        request: Bytebot.BrowserExtractRequest,
        requestOptions?: Browsers.RequestOptions
    ): Promise<Bytebot.BrowserExtractResponse> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.BytebotEnvironment.Default,
                "browsers/extract"
            ),
            method: "POST",
            headers: {
                "X-API-KEY": await core.Supplier.get(this._options.apiKey),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@bytebot/sdk",
                "X-Fern-SDK-Version": "0.4.2",
            },
            contentType: "application/json",
            body: request,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 120000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body as Bytebot.BrowserExtractResponse;
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

    /**
     * @throws {@link Bytebot.ServiceUnavailableError}
     *
     * @example
     *     await bytebot.browsers.status("sessionId")
     */
    public async status(
        sessionId: string,
        requestOptions?: Browsers.RequestOptions
    ): Promise<Bytebot.BrowserStatusResponse> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.BytebotEnvironment.Default,
                `browsers/status/${sessionId}`
            ),
            method: "GET",
            headers: {
                "X-API-KEY": await core.Supplier.get(this._options.apiKey),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@bytebot/sdk",
                "X-Fern-SDK-Version": "0.4.2",
            },
            contentType: "application/json",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 120000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body as Bytebot.BrowserStatusResponse;
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 503:
                    throw new Bytebot.ServiceUnavailableError(_response.error.body as unknown);
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
