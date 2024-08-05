import * as Bytebot from "../../../api";
import { BytebotError } from "../../../errors/BytebotError";
import {
  AttributesType,
  attributeNames,
  isAttribute,
  isBooleanAttribute,
} from "../../types/attributesType";
import {
  BytebotInvalidAttributeError,
  BytebotInvalidParametersError,
  BytebotMultipleElementsError,
  BytebotNoElementError,
} from "../../types/actionErrors";

// ************************
// *** Action functions ***
// ************************

/**
 * Get the innerText of a node
 * @param action The browser action object
 * @param page The page to get the node from
 * @returns The innerText of the node or null
 */
export async function copyText(
  action: Bytebot.BrowserAction.CopyText,
  page: any
): Promise<null | string> {
  let xp = action.xpath;
  xp = xp.replace(/\/text\(\)/g, "");
  return page.$("xpath=" + xp).then(async (elementNode: any) => {
    try {
      if (elementNode === null) {
        throw new BytebotNoElementError(action.xpath);
      }
      return await elementNode.evaluate((node: any) => {
        return (node as HTMLElement).innerText ?? null;
      });
    } finally {
      if (elementNode) await elementNode.dispose();
    }
  });
}

/**
 * Click on a node
 * @param action The browser action object
 * @param page The page to get the node from
 * @returns null
 */
export function click(
  action: Bytebot.BrowserAction.Click,
  page: any
): Promise<void> {
  return page.$("xpath=" + action.xpath).then(async (elementNode: any) => {
    try {
      if (elementNode === null) {
        throw new BytebotNoElementError(action.xpath);
      }
      return await elementNode.evaluate((node: any) => {
        (node as HTMLElement).click();
      });
    } finally {
      if (elementNode) await elementNode.dispose();
    }
  });
}

/**
 * Get the value of an attribute of a node
 * @param action The browser action object
 * @param page The page to get the node from
 * @returns The value of the attribute or null
 */
export async function copyAttribute(
  actionOption: Bytebot.BrowserAction.CopyAttribute,
  page: any
): Promise<null | string> {
  // Extract the element from the page according to the xpath
  const elementNode = await page.$("xpath=" + actionOption.xpath);

  let parameter_attribute: string | undefined;
  try {
    if (elementNode === null) {
      throw new BytebotNoElementError(actionOption.xpath);
    }
    // Validate the parameters
    if (!actionOption.attribute)
      throw new BytebotInvalidParametersError(actionOption.type);

    parameter_attribute = actionOption.attribute;
  } catch (e: any) {
    if (elementNode) await elementNode.dispose();
    throw e;
  }

  try {
    // *** Start Browser context ***
    return await elementNode.evaluate(
      (node: any, params: any) => {
        if (
          !params.attributeNames.includes(params.attribute as AttributesType)
        ) {
          // Throw an error with a specific message so we can catch it outside the browser context and throw a BytebotError
          throw new Error(`Invalid Attribute`);
        }
        const inputNode = node as HTMLElement;

        if (params.attribute === "href") {
          let href = inputNode.getAttribute("href");
          // Create a temporary anchor element to resolve the relative URL
          if (href) {
            const a = document.createElement("a");
            a.href = href;
            href = a.href; // This resolves the relative URL to an absolute URL
            a.remove();
          }
          return href ?? null;
        }

        return inputNode.getAttribute(params.attribute) ?? null;
      },
      { attribute: parameter_attribute, attributeNames }
    );
    // *** End Browser context ***
  } catch (e: any) {
    if (e.message === "Invalid Attribute" && parameter_attribute) {
      throw new BytebotInvalidAttributeError(parameter_attribute);
    }
    throw new BytebotError(e.message);
  } finally {
    if (elementNode) await elementNode.dispose();
  }
}

/**
 * Assign a value to an attribute of a node. NOTE that inputs are treated differently:
 * it will try to mimic the user typing the value in the input, or clicking it.
 * @param action The browser action object
 * @param page The page to get the node from
 * @returns null
 */
export async function assignAttribute(
  action: Bytebot.BrowserAction.AssignAttribute,
  page: any
): Promise<void> {
  // Extract the element from the page according to the xpath
  const elementNode = await page.$("xpath=" + action.xpath);

  let parameter_attribute: string | undefined;
  let parameter_value: string | undefined;
  try {
    if (elementNode === null) {
      throw new BytebotNoElementError(action.xpath);
    }

    // Validate the parameters
    if (!action.attribute)
      throw new BytebotInvalidParametersError(action.type, "attribute");
    parameter_attribute = action.attribute;
    if (!action.value)
      throw new BytebotInvalidParametersError(action.type, "value");
    parameter_value = action.value;
  } catch (e: any) {
    if (elementNode) await elementNode.dispose();
    throw e;
  }
  try {
    if (!isAttribute(parameter_attribute))
      throw new BytebotInvalidAttributeError(parameter_attribute);

    // Get the tag of the element
    const tagName = (
      await elementNode.evaluate((node: any) => (node as HTMLElement).tagName)
    ).toLowerCase() as string;
    //console.log(`Assigning ${parameter_value} to ${parameter_attribute} of ${tagName}`)
    // Deal with input elements
    if (
      tagName === "input" &&
      (parameter_attribute === "value" || parameter_attribute === "checked")
    ) {
      const inputType = await elementNode.evaluate((node: any) => {
        const inputNode = node as HTMLInputElement;
        return inputNode.type;
      });
      switch (inputType) {
        case "checkbox":
          const checked = await elementNode.evaluate(
            (node: any) => (node as HTMLInputElement).checked
          );
          if (parameter_value === "true" && !checked) {
            await elementNode.evaluate((node: any) =>
              (node as HTMLInputElement).click()
            );
          } else if (parameter_value === "false" && checked) {
            await elementNode.evaluate((node: any) =>
              (node as HTMLInputElement).click()
            );
          }
          return;
        case "radio":
          const radiochecked = await elementNode.evaluate(
            (node: any) => (node as HTMLInputElement).checked
          );
          if (parameter_value === "true" && !radiochecked) {
            await elementNode.evaluate((node: any) =>
              (node as HTMLInputElement).click()
            );
          } else if (parameter_value === "false" && radiochecked) {
            throw new BytebotInvalidParametersError("AssignAttribute", "value");
          }
          return;
        case "text":
        case "date":
        case "datetime-local":
        case "email":
        case "month":
        case "number":
        case "password":
        case "search":
        case "tel":
        case "time":
        case "url":
        case "week":
          //console.log(`Typing ${parameter_value} into ${parameter_attribute} of ${inputType}`)
          await elementNode.type(parameter_value, { delay: 100 });
          return;
        default:
        // DO NOTHING
      }
    }

    // Assign boolean attributes
    if (isBooleanAttribute(parameter_attribute)) {
      if (parameter_value === "true") {
        elementNode.evaluate(
          (node: any, parameter_attribute: any) =>
            (node as HTMLElement).setAttribute(parameter_attribute, "true"),
          parameter_attribute
        );
        return;
      }
      elementNode.evaluate(
        (node: any, parameter_attribute: any) =>
          (node as HTMLElement).removeAttribute(parameter_attribute),
        parameter_attribute
      );
      return;
    }

    // Assign any other attribute
    await elementNode.evaluate(
      (node: any, attribute: any, value: any) => {
        const inputNode = node as HTMLElement;
        inputNode.setAttribute(attribute, value);
      },
      parameter_attribute,
      parameter_value
    );
    return;
  } catch (e: any) {
    // Rethrow the error as a BytebotError
    if (e.message === "Invalid Attribute" && parameter_attribute) {
      throw new BytebotInvalidAttributeError(parameter_attribute);
    }
    throw new BytebotError(e.message);
  } finally {
    if (elementNode) await elementNode.dispose();
  }
}

/** Private type used to temporarily hold the content of a table cell */
type ExtractCell = {
  cellElement: any;
  name: string;
  actionType: string;
  attribute?: string;
};

/** Private function that validates the inputs of a cell and extracts the element from its xpath */
async function getTableCellHandle(
  cell: Bytebot.ExtractTableColumnBrowserAction,
  page: any
): Promise<ExtractCell> {
  const action = cell.action;
  // Validate the parameters of each column
  if (action.xpath === undefined || action.xpath === null)
    throw new BytebotInvalidParametersError(action.type, "xpath");
  if (cell.name === undefined || cell.name === null)
    throw new BytebotInvalidParametersError(action.type, "name");
  if (action.type !== "CopyText" && action.type !== "CopyAttribute")
    throw new BytebotInvalidParametersError("never", "type");
  if (
    action.type === "CopyAttribute" &&
    (action.attribute === undefined || action.attribute === null)
  )
    throw new BytebotInvalidParametersError(action.type, "attribute");

  const attr = action.type === "CopyAttribute" ? action.attribute : undefined;

  let xp = action.xpath;
  if (action.type === "CopyText") xp = xp.replace(/\/text\(\)/g, "");
  const node = await page.$("xpath=" + xp).then((elementNode: any) => {
    if (elementNode === null) {
      throw new BytebotNoElementError(xp);
    }
    xp;
    return elementNode;
  });
  return {
    cellElement: node,
    name: cell.name,
    actionType: action.type,
    attribute: attr,
  } as ExtractCell;
}

/**
 * Extract values from a table
 * @param action The action option object
 * @param page The page to get the node from
 * @returns An array of objects, each object representing a row of the table as a dictionary
 */
export async function extractTable(
  actionOption: Bytebot.BrowserAction.ExtractTable,
  page: any
): Promise<null | string | Record<string, string | null>[]> {
  if (!actionOption.rows)
    throw new BytebotInvalidParametersError(actionOption.type, "rows");
  if (actionOption.rows.length === 0) return [];

  let rows: ExtractCell[][] = [];
  try {
    let rowindex = -1;
    let columnindex = -1;
    for(const row of actionOption.rows){
      rowindex++;
      columnindex = -1;
      for(const col of row){
        columnindex++;
        const result = await getTableCellHandle(col, page);
        if(!rows[rowindex]) rows[rowindex] = [];
        rows[rowindex][columnindex] = result;
      }
    }
    
  } catch (e: any) {
    rows.forEach(async (row) =>
      row.forEach(async (column) => await column.cellElement.dispose())
    );
    throw e;
  }

  let results: { [key: string]: string | null }[] = [];
  try {
    let rowIndex = -1;
    for (const row of rows) {
      rowIndex++;
      for (const column of row) {
        let value: string | null = null;
        if (column.actionType === "CopyText") {
          value = await column.cellElement.evaluate((node: any) => {
            if (node.nodeType === 3) return (node as Text).data.trim();
            return (node as HTMLElement).innerText ?? null;
          });
        }
        if (column.actionType === "CopyAttribute") {
          value = await column.cellElement.evaluate(
            (node: any, attribute: any) => {
              const inputNode = node as HTMLElement;
              return inputNode.getAttribute(attribute!) ?? null;
            },
            column.attribute
          );
        }
        results[rowIndex] = {
          ...results[rowIndex],
          [column.name]: value?.toString() || null,
        };
      }
    }

    return results;
  } catch (e: any) {
    // Rethrow the error as a BytebotError
    if (
      (e.message as string)?.startsWith(
        "ExtractTable: unknown column action type"
      )
    ) {
      const actionType = (e.message as string).split(":")[2].trim();
      throw new BytebotInvalidParametersError(actionOption.type, actionType);
    }
    throw new BytebotError(e.message);
  } finally {
    rows.forEach(async (row) =>
      row.forEach(async (column) => await column.cellElement.dispose())
    );
  }
}
