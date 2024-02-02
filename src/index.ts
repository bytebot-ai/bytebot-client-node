import { BytebotClient } from "./wrapper/BytebotClient";

export * as Bytebot from "./api";
export { BytebotClient } from "./wrapper/BytebotClient";
export { BytebotEnvironment } from "./environments";
export { BytebotError, BytebotTimeoutError } from "./errors";

export default new BytebotClient();
