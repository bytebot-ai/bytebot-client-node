/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Bytebot from "..";

export type BrowserActResponseActionsItem =
    | Bytebot.BrowserActResponseActionsItem.Click
    | Bytebot.BrowserActResponseActionsItem.AssignAttribute;

export declare namespace BrowserActResponseActionsItem {
    interface Click extends Bytebot.ClickBrowserAction {
        type: "Click";
    }

    interface AssignAttribute extends Bytebot.AssignAttributeBrowserAction {
        type: "AssignAttribute";
    }
}