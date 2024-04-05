/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Bytebot from "..";

export type ActResponseActionsItem =
    | Bytebot.ActResponseActionsItem.Click
    | Bytebot.ActResponseActionsItem.AssignAttribute;

export declare namespace ActResponseActionsItem {
    interface Click extends Bytebot.ClickBrowserAction {
        type: "Click";
    }

    interface AssignAttribute extends Bytebot.AssignAttributeBrowserAction {
        type: "AssignAttribute";
    }
}