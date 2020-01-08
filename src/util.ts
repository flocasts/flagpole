import { iMessageAndCallback, iScenario, iNextCallback } from "./interfaces";

const path = require("path");
const cheerio = require("cheerio");

/**
 * Is this object null or undefined?
 *
 * @param obj
 * @returns {boolean}
 */
export function isNullOrUndefined(obj: any): boolean {
  return typeof obj === "undefined" || obj === null;
}

/**
 * Get the real and normalized type of object
 *
 * @param obj
 * @returns {string}
 */
export function toType(obj: any): string {
  if (typeof obj === "undefined") {
    return "undefined";
  } else if (obj === null) {
    return "null";
  } else if (obj === NaN) {
    return "nan";
  } else if (obj instanceof cheerio) {
    return "cheerio";
  } else if (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function" &&
    typeof obj.catch === "function"
  ) {
    return "promise";
  } else if (obj && obj.constructor && obj.constructor.name) {
    return String(obj.constructor.name).toLocaleLowerCase();
  } else if (obj && obj.constructor && obj.constructor.toString) {
    let arr = obj.constructor.toString().match(/function\s*(\w+)/);
    if (arr && arr.length == 2) {
      return String(arr[1]).toLocaleLowerCase();
    }
  }
  // This confusing mess gets deep typeof
  const match: RegExpMatchArray | null = {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/);
  return match !== null ? String(match[1]).toLocaleLowerCase() : "";
}

export function uniqueId(): string {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
}

export async function openInBrowser(content: string): Promise<string> {
  const open = require("open");
  const fs = require("fs");
  const tmp = require("tmp");
  const tmpObj = tmp.fileSync({ postfix: ".html" });
  const filePath: string = tmpObj.name;
  console.log(filePath);
  fs.writeFileSync(filePath, content);
  await open(filePath);
  return filePath;
}

export function runAsync(callback: Function, delay: number = 1) {
  setTimeout(callback, delay);
}

export function asyncForEach(array: any[], callback: Function): Promise<void> {
  return new Promise(resolve => {
    const promises: Promise<any>[] = [];
    for (let i = 0; i < array.length; i++) {
      promises.push(callback(array[i], i, array));
    }
    Promise.all(promises).then(() => {
      resolve();
    });
  });
}

/**
 * Have folder path always end in a /
 *
 * @param path
 */
export function normalizePath(uri: string): string {
  if (uri) {
    uri = uri.endsWith(path.sep) ? uri : uri + path.sep;
  }
  return uri;
}

export function exitProcess(passed: boolean) {
  process.exit(passed ? 0 : 1);
}

export function getMessageAndCallbackFromOverloading(
  a: any,
  b: any,
  defaultMessage: string = "Untitled"
): iMessageAndCallback {
  const message: string = typeof a == "string" ? a : defaultMessage;
  const callback: iNextCallback = (function() {
    // Handle overloading
    if (typeof b == "function") {
      return b;
    } else if (typeof a == "function") {
      return a;
    }
    // No callback was set, so just create a blank one
    else {
      return function() {};
    }
  })();
  const scenario: iScenario = (function() {
    if (toType(a) == "scenario") {
      return a;
    } else if (toType(b) == "scenario") {
      return b;
    }
    return undefined;
  })();
  return {
    isSubScenario: a || b,
    message: message,
    callback: callback,
    scenario: scenario
  };
}