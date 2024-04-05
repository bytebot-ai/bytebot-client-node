/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Bytebot from "..";

export type TableExtractColumnSchema =
    | Bytebot.TableExtractColumnSchema.Text
    | Bytebot.TableExtractColumnSchema.Attribute;

export declare namespace TableExtractColumnSchema {
    interface Text extends Bytebot.TextExtractSchema {
        type: "Text";
    }

    interface Attribute extends Bytebot.AttributeExtractSchema {
        type: "Attribute";
    }
}