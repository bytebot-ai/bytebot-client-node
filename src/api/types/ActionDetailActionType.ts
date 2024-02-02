/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * The type of action to be performed
 */
export type ActionDetailActionType = "CopyAttribute" | "AssignAttribute" | "Click" | "CopyText" | "ExtractTable";

export const ActionDetailActionType = {
    CopyAttribute: "CopyAttribute",
    AssignAttribute: "AssignAttribute",
    Click: "Click",
    CopyText: "CopyText",
    ExtractTable: "ExtractTable",
} as const;
