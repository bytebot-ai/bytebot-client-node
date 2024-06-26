/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Bytebot from "..";

export type BrowserAction =
    | Bytebot.BrowserAction.CopyAttribute
    | Bytebot.BrowserAction.AssignAttribute
    | Bytebot.BrowserAction.ExtractTable
    | Bytebot.BrowserAction.CopyText
    | Bytebot.BrowserAction.Click;

export declare namespace BrowserAction {
    interface CopyAttribute extends Bytebot.CopyAttributeBrowserAction {
        type: "CopyAttribute";
    }

    interface AssignAttribute extends Bytebot.AssignAttributeBrowserAction {
        type: "AssignAttribute";
    }

    interface ExtractTable extends Bytebot.ExtractTableBrowserAction {
        type: "ExtractTable";
    }

    interface CopyText extends Bytebot.CopyTextBrowserAction {
        type: "CopyText";
    }

    interface Click extends Bytebot.ClickBrowserAction {
        type: "Click";
    }
}
