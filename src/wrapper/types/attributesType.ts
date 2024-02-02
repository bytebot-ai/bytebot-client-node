export const attributeNames = [
    "class",
    "id",
    "style",
    "title",
    "href",
    "src",
    "alt",
    "type",
    "value",
    "name",
    "placeholder",
    "disabled",
    "checked",
    "readonly",
    "selected",
    "multiple",
    "required",
    "autoplay",
    "controls",
    "loop",
    "target",
    "rel",
    "download",
    "accesskey",
    "tabindex"
] as const;
export type AttributesType = (typeof attributeNames)[number];
export function isAttribute(attribute: string): attribute is AttributesType {
  return attributeNames.includes(attribute as AttributesType);
}
// Define the boolean attributes as a const array
export const booleanAttributeNames = [
    "autoplay",
    "checked",
    "controls",
    "disabled",
    "loop",
    "multiple",
    "readonly",
    "required",
    "selected"
] as const;

// Use a mapped type to extract only the types from AttributesType that are also in booleanAttributeNames
export type BooleanAttributesType = (typeof booleanAttributeNames)[number] &
  AttributesType;
export function isBooleanAttribute(
  attribute: string
): attribute is BooleanAttributesType {
  return booleanAttributeNames.includes(attribute as BooleanAttributesType);
}

export function parseAttribute(attribute:string):AttributesType {
  if(isAttribute(attribute)) {
    return attribute;
  }
  throw new Error(`Attribute ${attribute} is not a valid attribute`);
}
export function parseBooleanAttribute(attribute:string):BooleanAttributesType {
    if(isBooleanAttribute(attribute)) {
        return attribute;
    }
    throw new Error(`Attribute ${attribute} is not a valid boolean attribute`);
    }