import * as Bytebot from "../api";
import { ElementHandle, Page } from "puppeteer";
import {
  AttributesType,
  BooleanAttributesType,
  attributeNames,
  booleanAttributeNames,
} from "./types/attributesType";

// ****************************************
// *** Helper functions (note exported) ***
// ****************************************

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
  evaluateFun: (node: HTMLElement) => Bytebot.ActionDetailResult
): Promise<Bytebot.ActionDetailResult> {
  return page.$x(xpath).then((elementNodes) => {
    try {
      if (elementNodes.length > 1) {
        throw new Error(`More than one element found for xpath ${xpath}`);
      }
      if (elementNodes.length === 0) {
        throw new Error(`No element found for xpath ${xpath}`);
      }
      return elementNodes[0].evaluate(evaluateFun);
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
export function copyText(
  actionOption: Bytebot.ActionDetail,
  page: Page
): Promise<Bytebot.ActionDetailResult> {
  return runEvaluateOneElement(
    actionOption.xpath,
    page,
    (node) => node.innerText ?? null
  );
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
    node.click();
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
  actionOption: Bytebot.ActionDetail,
  page: Page
): Promise<Bytebot.ActionDetailResult> {
  const elementNodes = await page.$x(actionOption.xpath);
  try {
    if (elementNodes.length > 1) {
      throw new Error(
        `More than one element found for xpath ${actionOption.xpath}`
      );
    }
    if (elementNodes.length === 0) {
      throw new Error(`No element found for xpath ${actionOption.xpath}`);
    }
    const pars = actionOption.parameters as Bytebot.AssignAttributeParameters;
    return await elementNodes[0].evaluate(
      (node, attribute, attributeNames) => {
        if (!attributeNames.includes(attribute as AttributesType)) {
          throw new Error(`Attribute ${attribute} is not a valid attribute`);
        }

        const inputNode = node as HTMLElement;
        return inputNode.getAttribute(attribute) ?? null;
      },
      pars.attribute,
      attributeNames
    );
  } finally {
    elementNodes.forEach(async (element) => await element.dispose());
  }
}

/**
 * Assign a value to an attribute of a node
 * @param actionOption The action option object
 * @param page The page to get the node from
 * @returns null
 */
export async function assignAttribute(
  actionOption: Bytebot.ActionDetail,
  page: Page
): Promise<Bytebot.ActionDetailResult> {
  const elementNodes = await page.$x(actionOption.xpath);
  try {
    if (elementNodes.length > 1) {
      throw new Error(
        `More than one element found for xpath ${actionOption.xpath}`
      );
    }
    if (elementNodes.length === 0) {
      throw new Error(`No element found for xpath ${actionOption.xpath}`);
    }
    const pars = actionOption.parameters as Bytebot.AssignAttributeParameters;
    await elementNodes[0].evaluate(
      (node, attribute, value, attributeNames, booleanAttributeNames) => {
        if (!attributeNames.includes(attribute as AttributesType)) {
          throw new Error(`Attribute ${attribute} is not a valid attribute`);
        }
        const inputNode = node as HTMLElement;

        // If the attribute is not a boolean attribute, just set it
        if (
          !booleanAttributeNames.includes(attribute as BooleanAttributesType)
        ) {
          inputNode.setAttribute(attribute, value);
          return null;
        }

        // If the attribute is a boolean attribute, set it if value is "true", remove it otherwise
        if (value === "true") {
          inputNode.setAttribute(attribute, "");
          return null;
        }
        inputNode.removeAttribute(attribute);
        return null;
      },
      pars.attribute,
      pars.value,
      attributeNames,
      booleanAttributeNames
    );
    return null;
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
  actionOption: Bytebot.ActionDetail,
  page: Page
): Promise<Bytebot.ActionDetailResult> {
  type ExtractColumn = {
    column: ElementHandle<Node>[];
    name: string;
    actionType: string;
    parameters?: Bytebot.TableColumnParameters;
  };
  const parameters = actionOption.parameters as Bytebot.ExtractTableParameters;
  const xpath = actionOption.xpath;
  if (!parameters.columns) throw new Error("Columns not defined");

  const rows = await page.$x(xpath);

  // convert parameters.columns to an array ExtractColumn objects
  const columns: ExtractColumn[] = await concatenatePromises(
    parameters.columns.map(async (column) => {
      return {
        column: await page.$x(column.xpath),
        name: column.name,
        actionType: column.actionType,
        parameters: column.parameters,
      };
    })
  );

  try {
    // create an array the same length as the number of rows
    let results: { [key: string]: string | null }[] = new Array(
      rows.length
    ).fill({});

    for (const column of columns) {
      for (const element of column.column) {
        let [rowIndex, value] = await page.evaluate(
          // The context of this function is isolated from node, so we have to
          // pass any variables we need
          (column, element, ...rows) => {
            // Need to define isParent function here because it's not available in the browser context
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

            // Need to define fun here because it's not available in the browser context
            let fun: (
              node: HTMLElement,
              parameters?: Bytebot.TableColumnParameters
            ) => string | null;
            switch (column.actionType) {
              case "CopyText":
                fun = (node: HTMLElement) => node.innerText ?? null; // FIXME: InnerHtml?
                break;
              case "CopyAttribute":
                fun = (
                  node: HTMLElement,
                  parameters?: Bytebot.TableColumnParameters
                ) =>
                  parameters?.attribute
                    ? node.getAttribute(parameters.attribute)
                    : null;
                break;
              default:
                throw new Error(
                  `ExtractTable: unknown action type ${column.actionType}`
                );
            }

            const rowIndex: number = rows.findIndex((row) =>
              isParent(row, element)
            );
            let value = null;
            // If the element is a child of a row, get the value
            if (rowIndex > -1) {
              value = fun(element as HTMLElement, column.parameters);
            }

            return [rowIndex, value];
          },
          column,
          element,
          ...rows
        );

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
  } finally {
    rows.forEach(async (row) => await row.dispose());
    columns.forEach((column) =>
      column.column.forEach(async (element) => await element.dispose())
    );
  }
}
