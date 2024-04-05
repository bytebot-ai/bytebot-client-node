import { BytebotClient } from "./wrapper/BytebotClient";

export * as Bytebot from "./api";
export { BytebotClient } from "./wrapper/BytebotClient";
export { BytebotEnvironment } from "./environments";
export { BytebotError, BytebotTimeoutError } from "./errors";
export { Table, Column, Text, Attribute } from "./wrapper/helpers";

export default new BytebotClient();
