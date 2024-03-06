import * as Bytebot from "../api";
import { BytebotError } from "../errors/BytebotError";
import { ElementHandle, Page } from "puppeteer";
import {
  AttributesType,
  BooleanAttributesType,
  attributeNames,
  booleanAttributeNames,
  isAttribute,
  isBooleanAttribute,
} from "./types/attributesType";
import {
  BytebotInvalidAttributeError,
  BytebotInvalidParametersError,
  BytebotMultipleElementsError,
  BytebotNoElementError,
} from "./types/actionErrors";

// ***************************************
// *** Helper functions (not exported) ***
// ***************************************

function joinPath(absolute: string, relative: string): string {
  if (absolute.endsWith("/")) absolute = absolute.slice(0, -1);
  if (relative === "" || relative === "." ) return absolute;
  if (relative.startsWith("./")) relative = relative.slice(2);
  if (relative.startsWith("/")) relative = relative.slice(1);
  return `${absolute}/${relative}`;
}

/** Turn an array of promises into a promise of an array. The promises are executed sequentially, NOT in parallel like Promise.all*/
async function concatenatePromises<T>(promises: Promise<T>[]): Promise<T[]> {
  if (promises.length === 0) {
    return Promise.resolve([]);
  }
  if (promises.length === 1) {
    const prom = promises[0];
    return prom.then((res) => [res]);
  }
  const [first, ...rest] = promises;
  return first.then((res_1) =>
    concatenatePromises(rest).then((res2) => [res_1, ...res2])
  );
}
/**
 * Extract the element from the page according to the xpath and evaluate the function on the element.
 * Works for functions that don't require parameters
 * */
async function runEvaluateOneElement(
  xpath: string,
  page: Page,
  evaluateFun: (node: Node) => Bytebot.ActionDetailResult
): Promise<Bytebot.ActionDetailResult> {
  return page.$x(xpath).then(async (elementNodes) => {
    try {
      if (elementNodes.length > 1) {
        throw new BytebotMultipleElementsError(xpath);
      }
      if (elementNodes.length === 0) {
        throw new BytebotNoElementError(xpath);
      }
      return await elementNodes[0].evaluate(evaluateFun);
    } finally {
      elementNodes.forEach(async (element) => await element.dispose());
    }
  });
}

// ************************
// *** Action functions ***
// ************************

/**
 * Get the innerText of a node
 * @param actionOption The action option object
 * @param page The page to get the node from
 * @returns The innerText of the node or null
 */
export async function copyText(
  actionOption: Bytebot.ActionDetail,
  page: Page
): Promise<Bytebot.ActionDetailResult> {
  return runEvaluateOneElement(actionOption.xpath, page, (node) => {
    return (node as HTMLElement).innerText ?? null;
  });
}

/**
 * Click on a node
 * @param actionOption The action option object
 * @param page The page to get the node from
 * @returns null
 */
export function click(
  actionOption: Bytebot.ActionDetail,
  page: Page
): Promise<Bytebot.ActionDetailResult> {
  return runEvaluateOneElement(actionOption.xpath, page, (node) => {
    (node as HTMLElement).click();
    return null;
  });
}

/**
 * Get the value of an attribute of a node
 * @param actionOption The action option object
 * @param page The page to get the node from
 * @returns The value of the attribute or null
 */
export async function copyAttribute(
  actionOption: Bytebot.ActionDetail.CopyAttribute,
  page: Page
): Promise<Bytebot.ActionDetailResult> {
  // Extract the element from the page according to the xpath
  const elementNodes = await page.$x(actionOption.xpath);

  let parameter_attribute: string | undefined;
  try {
    // Validate the number of elements
    if (elementNodes.length > 1) {
      throw new BytebotMultipleElementsError(actionOption.xpath);
    }
    if (elementNodes.length === 0) {
      throw new BytebotNoElementError(actionOption.xpath);
    }

    // Validate the parameters
    if (!actionOption.attribute)
      throw new BytebotInvalidParametersError(actionOption.actionType);

    parameter_attribute = actionOption.attribute;
  } catch (e: any) {
    elementNodes.forEach(async (element) => await element.dispose());
    throw e;
  }

  try {
    // *** Start Browser context ***
    return await elementNodes[0].evaluate(
      (node, attribute, attributeNames) => {
        if (!attributeNames.includes(attribute as AttributesType)) {
          // Throw an error with a specific message so we can catch it outside the browser context and throw a BytebotError
          throw new Error(`Invalid Attribute`);
        }
        const inputNode = node as HTMLElement;
        return inputNode.getAttribute(attribute) ?? null;
      },
      parameter_attribute,
      attributeNames
    );
    // *** End Browser context ***
  } catch (e: any) {
    if (e.message === "Invalid Attribute" && parameter_attribute) {
      throw new BytebotInvalidAttributeError(parameter_attribute);
    }
    throw new BytebotError(e.message);
  } finally {
    elementNodes.forEach(async (element) => await element.dispose());
  }
}

/**
 * Assign a value to an attribute of a node. NOTE that inputs are treated differently:
 * it will try to mimic the user typing the value in the input, or clicking it.
 * @param actionOption The action option object
 * @param page The page to get the node from
 * @returns null
 */
export async function assignAttribute(
  actionOption: Bytebot.ActionDetail.AssignAttribute,
  page: Page
): Promise<Bytebot.ActionDetailResult> {
  // Extract the element from the page according to the xpath
  const elementNodes = await page.$x(actionOption.xpath);

  let parameter_attribute: string | undefined;
  let parameter_value: string | undefined;
  try {
    // Validate the number of elements
    if (elementNodes.length > 1) {
      throw new BytebotMultipleElementsError(actionOption.xpath);
    }
    if (elementNodes.length === 0) {
      throw new BytebotNoElementError(actionOption.xpath);
    }

    // Validate the parameters
    if (!actionOption.attribute)
      throw new BytebotInvalidParametersError(
        actionOption.actionType,
        "attribute"
      );
    parameter_attribute = actionOption.attribute;
    if (!actionOption.value)
      throw new BytebotInvalidParametersError(actionOption.actionType, "value");
    parameter_value = actionOption.value;
  } catch (e: any) {
    elementNodes.forEach(async (element) => await element.dispose());
    throw e;
  }
  try {
    if (!isAttribute(parameter_attribute))
      throw new BytebotInvalidAttributeError(parameter_attribute);
    const element = elementNodes[0];
    // Get the tag of the element
    const tagName = (
      await element.evaluate((node) => (node as HTMLElement).tagName)
    ).toLowerCase() as string;
    //console.log(`Assigning ${parameter_value} to ${parameter_attribute} of ${tagName}`)
    // Deal with input elements
    if (
      tagName === "input" &&
      (parameter_attribute === "value" || parameter_attribute === "checked")
    ) {
      const inputType = await element.evaluate((node) => {
        const inputNode = node as HTMLInputElement;
        return inputNode.type;
      });
      switch (inputType) {
        case "checkbox":
          const checked = await element.evaluate(
            (node) => (node as HTMLInputElement).checked
          );
          if (parameter_value === "true" && !checked) {
            await element.evaluate((node) =>
              (node as HTMLInputElement).click()
            );
          } else if (parameter_value === "false" && checked) {
            await element.evaluate((node) =>
              (node as HTMLInputElement).click()
            );
          }
          return null;
        case "radio":
          const radiochecked = await element.evaluate(
            (node) => (node as HTMLInputElement).checked
          );
          if (parameter_value === "true" && !radiochecked) {
            await element.evaluate((node) =>
              (node as HTMLInputElement).click()
            );
          } else if (parameter_value === "false" && radiochecked) {
            throw new BytebotInvalidParametersError("AssignAttribute", "value");
          }
          return null;
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
          await element.type(parameter_value, { delay: 100 });
          return null;
        default:
        // DO NOTHING
      }
    }

    // Assign boolean attributes
    if (isBooleanAttribute(parameter_attribute)) {
      if (parameter_value === "true") {
        elementNodes[0].evaluate(
          (node, parameter_attribute) =>
            (node as HTMLElement).setAttribute(parameter_attribute, "true"),
          parameter_attribute
        );
        return null;
      }
      elementNodes[0].evaluate(
        (node, parameter_attribute) =>
          (node as HTMLElement).removeAttribute(parameter_attribute),
        parameter_attribute
      );
      return null;
    }

    // Assign any other attribute
    await element.evaluate(
      (node, attribute, value) => {
        const inputNode = node as HTMLElement;
        inputNode.setAttribute(attribute, value);
      },
      parameter_attribute,
      parameter_value
    );
    return null;
  } catch (e: any) {
    // Rethrow the error as a BytebotError
    if (e.message === "Invalid Attribute" && parameter_attribute) {
      throw new BytebotInvalidAttributeError(parameter_attribute);
    }
    throw new BytebotError(e.message);
  } finally {
    elementNodes.forEach(async (element) => await element.dispose());
  }
}

/**
 * Extract values from a table
 * @param actionOption The action option object
 * @param page The page to get the node from
 * @returns An array of objects, each object representing a row of the table as a dictionary
 */
export async function extractTable(
  actionOption: Bytebot.ActionDetail.ExtractTable,
  page: Page
): Promise<Bytebot.ActionDetailResult> {
  // Define a type to hold the handle and the parameters of a column
  type ExtractColumn = {
    column: ElementHandle<Node>[];
    name: string;
    actionType: string;
    attribute?: string;
  };
  // Validate the parameters
  const xpath = actionOption.xpath;
  let columns: ExtractColumn[] = [];
  let rows: ElementHandle<Node>[] = [];
  try {
    if (!actionOption.columns)
      throw new BytebotInvalidParametersError(
        actionOption.actionType,
        "columns"
      );

    // convert parameters.columns to an array of ExtractColumn objects
    columns = await concatenatePromises(
      actionOption.columns.map(async (column) => {
        // Validate the parameters of each column
        if (column.xpath === undefined || column.xpath === null)
          throw new BytebotInvalidParametersError(
            actionOption.actionType,
            "columns.xpath"
          );
        if (!column.name)
          throw new BytebotInvalidParametersError(
            actionOption.actionType,
            "columns.name"
          );

        const colXpath = joinPath(xpath, column.xpath);
        const attr =
          column.actionType === "CopyAttribute" ? column.attribute : undefined;
        return {
          column: await page.$x(colXpath),
          name: column.name,
          actionType: column.actionType,
          attribute: attr,
        };
      })
    );

    rows = await page.$x(xpath);
  } catch (e: any) {
    columns.forEach(async (column) =>
      column.column.forEach(async (element) => await element.dispose())
    );
    rows.forEach(async (row) => await row.dispose());
    throw e;
  }
  // create an array the same length as the number of rows
  let results: { [key: string]: string | null }[] = new Array(rows.length).fill(
    {}
  );
  try {
    for (const column of columns) {
      for (const element of column.column) {
        // *** Start Browser context ***
        let [rowIndex, value] = await page.evaluate(
          (column, element, ...rows) => {
            const isParent: (parent: Node, child: Node) => boolean = (
              parent: Node,
              child: Node
            ) => {
              if (parent === child) {
                return true;
              }
              if (child.parentNode) {
                return isParent(parent, child.parentNode);
              }
              return false;
            };

            let fun: (node: HTMLElement, attribute?: string) => string | null;
            switch (column.actionType) {
              case "CopyText":
                fun = (node: HTMLElement) => node.innerText ?? null; // FIXME: InnerHtml?
                break;
              case "CopyAttribute":
                fun = (node: HTMLElement, attribute?: string) =>
                  attribute ? node.getAttribute(attribute) : null;
                break;
              default:
                throw new Error(
                  `ExtractTable: unknown column action type: ${column.actionType}`
                );
            }

            const rowIndex: number = rows.findIndex((row) =>
              isParent(row, element)
            );
            let value = null;
            // If the element is a child of a row, get the value
            if (rowIndex > -1) {
              value = fun(element as HTMLElement, column.attribute);
            }

            return [rowIndex, value];
          },
          column,
          element,
          ...rows
        );
        // *** End Browser context ***

        // Establish rowIndex as a number
        // (it's serialized as a string | number | null type by page.evaluate)
        if (typeof rowIndex === "number") {
          rowIndex = rowIndex as number;

          if (rowIndex > -1) {
            results[rowIndex] = {
              ...results[rowIndex],
              [column.name]: value?.toString() || null,
            };
          }
        }
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
      throw new BytebotInvalidParametersError(
        actionOption.actionType,
        actionType
      );
    }
    throw new BytebotError(e.message);
  } finally {
    columns.forEach(async (column) =>
      column.column.forEach(async (element) => await element.dispose())
    );
    rows.forEach(async (row) => await row.dispose());
  }
}