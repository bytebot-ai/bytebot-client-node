import { BytebotError } from "../../errors";

export class BytebotMultipleElementsError extends BytebotError {
  constructor(xpath: string) {
    super({ message: `More than one element found for xpath ${xpath}` });
    
    Object.setPrototypeOf(this, BytebotMultipleElementsError.prototype);
    this.name = "BytebotMultipleElementsError";
  }
}

export class BytebotNoElementError extends BytebotError {
  constructor(xpath: string) {
    super({ message: `No element found for xpath ${xpath}`});
    Object.setPrototypeOf(this, BytebotNoElementError.prototype);
    this.name = "BytebotNoElementError";
  }
}

export class BytebotInvalidAttributeError extends BytebotError {
  constructor(attribute: string) {
    super({ message: `Invalid attribute ${attribute}`});
    Object.setPrototypeOf(this, BytebotInvalidAttributeError.prototype);
    this.name = "BytebotInvalidAttributeError";
  }
}

export class BytebotInvalidActionError extends BytebotError {
  constructor(actionType: string) {
    super({ message: `Invalid action ${actionType}`});
    Object.setPrototypeOf(this, BytebotInvalidActionError.prototype);
    this.name = "BytebotInvalidActionError";
  }
}

export class BytebotInvalidParametersError extends BytebotError {
  constructor(actionType: string, parameter?: string) {
    let msg = `Invalid parameters for action ${actionType}`;
    if (parameter) {
      msg += `: parameter ${parameter}`;
    }
    super({ message: msg});
    Object.setPrototypeOf(this, BytebotInvalidParametersError.prototype);
    this.name = "BytebotInvalidParametersError";
  }
}
