/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Bytebot from "..";

export interface ActionDetail {
    /** The type of action to be performed */
    actionType: Bytebot.ActionDetailActionType;
    /** The XPath to the element(s) on which the action is to be performed */
    xpath: string;
    parameters?: Bytebot.ActionDetailParameters;
    /** The result of the action, which can be null, a string, or an array of dictionaries with string keys and values that are either strings or null */
    result?: Bytebot.ActionDetailResult;
}
