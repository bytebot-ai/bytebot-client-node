/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Bytebot from "..";

export type ActionDetail =
    | Bytebot.ActionDetail.CopyAttribute
    | Bytebot.ActionDetail.AssignAttribute
    | Bytebot.ActionDetail.ExtractTable
    | Bytebot.ActionDetail.CopyText
    | Bytebot.ActionDetail.Click;

export declare namespace ActionDetail {
    interface CopyAttribute extends Bytebot.CopyAttributeActionDetail {
        actionType: "CopyAttribute";
    }

    interface AssignAttribute extends Bytebot.AssignAttributeActionDetail {
        actionType: "AssignAttribute";
    }

    interface ExtractTable extends Bytebot.ExtractTableActionDetail {
        actionType: "ExtractTable";
    }

    interface CopyText extends Bytebot.CopyTextActionDetail {
        actionType: "CopyText";
    }

    interface Click extends Bytebot.ClickActionDetail {
        actionType: "Click";
    }
}
