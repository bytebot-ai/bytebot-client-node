import { BytebotError } from "../errors/BytebotError";

export class BytebotGenerationError extends BytebotError {
  constructor(serverError: string) {
    super({ message: `Error generating actions: ${serverError}` });
    Object.setPrototypeOf(this, BytebotGenerationError.prototype);
    this.name = "BytebotGenerationError";
  }
}
