import {
  iAssertionContext,
  iScenario,
  iBounds,
  iValue,
  ScreenshotOpts,
  KeyValue,
} from "./interfaces";
import {
  JSHandle,
  Page,
  ElementHandle,
  BoxModel,
  EvaluateFn,
} from "puppeteer-core";
import { DOMElement } from "./domelement";
import {
  asyncForEach,
  toType,
  getMessageAndCallbackFromOverloading,
} from "./util";

export class PuppeteerElement extends DOMElement implements iValue {
  protected _input: ElementHandle;

  public get $(): ElementHandle {
    return this._input;
  }

  public static create(
    input: any,
    context: iAssertionContext,
    name: string | null = null,
    path?: string
  ): Promise<PuppeteerElement> {
    return new Promise((resolve) => {
      const element = new PuppeteerElement(input, context, name, path);
      if (name === null) {
        element._name = String(path);
      }
      Promise.all([element._getTagName(), element._getSourceCode()]).then(
        () => {
          resolve(element);
        }
      );
    });
  }

  protected constructor(
    input: any,
    context: iAssertionContext,
    name?: string | null,
    path?: string
  ) {
    super(input, context, name, path);
    this._input = input;
    this._path = path || "";
  }

  public toString(): string {
    return String(this.path);
  }

  public async find(selector: string): Promise<iValue> {
    const element: ElementHandle | null = await this.$.$(selector);
    const name: string = `${selector} under ${this.name}`;
    const path: string = `${this.path} ${selector}`;
    if (element !== null) {
      return PuppeteerElement.create(element, this._context, name, path);
    }
    return this._wrapAsValue(null, name);
  }

  public async findAll(selector: string): Promise<PuppeteerElement[]> {
    const elements: ElementHandle[] = await this.$.$$(selector);
    const out: PuppeteerElement[] = [];
    await asyncForEach(elements, async (element: ElementHandle, i: number) => {
      out.push(
        await PuppeteerElement.create(
          element,
          this._context,
          `${selector}[${i}] under ${this.name}`,
          `${this.path} ${selector}[${i}]`
        )
      );
    });
    return out;
  }

  public async getClosest(selector: string = "*"): Promise<iValue> {
    const closest: ElementHandle[] = await this.$.$x(
      `ancestor-or-self::${selector}`
    );
    const name: string = `Closest ${selector} of ${this.name}`;
    const path: string = `${this.path}[ancestor-or-self::${selector}]`;
    if (closest.length > 0) {
      return PuppeteerElement.create(closest[0], this._context, name, path);
    }
    return this._wrapAsValue(null, name, this);
  }

  public async getChildren(selector: string = "*"): Promise<iValue[]> {
    const children: ElementHandle[] = await this.$.$x(`child::${selector}`);
    const out: PuppeteerElement[] = [];
    await asyncForEach(children, async (child: ElementHandle, i: number) => {
      const name: string = `Child ${selector} ${i} of ${this.name}`;
      const path: string = `${this.path}[child::${selector}][${i}]`;
      out.push(await PuppeteerElement.create(child, this._context, name, path));
    });
    return out;
  }

  public async getParent(): Promise<iValue> {
    const parents: ElementHandle[] = await this.$.$x("..");
    const name: string = `Parent of ${this.name}`;
    const path: string = `${this.path}[..]`;
    if (parents.length > 0) {
      return PuppeteerElement.create(parents[0], this._context, name, path);
    }
    return this._wrapAsValue(null, name, this);
  }

  public async getSiblings(selector: string = "*"): Promise<iValue[]> {
    const prevSiblings: ElementHandle[] = await this.$.$x(
      `preceding-sibling::${selector}`
    );
    const nextSiblings: ElementHandle[] = await this.$.$x(
      `following-sibling::${selector}`
    );
    const siblings: PuppeteerElement[] = [];
    await asyncForEach(
      prevSiblings.concat(nextSiblings),
      async (sibling: ElementHandle, i: number) => {
        const name: string = `Sibling ${i} of ${this.name}`;
        const path: string = `${this.path}[sibling::${selector}][${i}]`;
        siblings.push(
          await PuppeteerElement.create(sibling, this._context, name, path)
        );
      }
    );
    return siblings;
  }

  public async getPreviousSibling(selector: string = "*"): Promise<iValue> {
    const siblings: ElementHandle[] = await this.$.$x(
      `preceding-sibling::${selector}`
    );
    const name: string = `Previous Sibling of ${this.name}`;
    const path: string = `${this.path}[preceding-sibling::${selector}][0]`;
    if (siblings.length > 0) {
      return PuppeteerElement.create(siblings[0], this._context, name, path);
    }
    return this._wrapAsValue(null, name, this);
  }

  public async getPreviousSiblings(selector: string = "*"): Promise<iValue[]> {
    const siblingElements: ElementHandle[] = await this.$.$x(
      `preceding-sibling::${selector}`
    );
    const siblings: PuppeteerElement[] = [];
    await asyncForEach(
      siblingElements,
      async (sibling: ElementHandle, i: number) => {
        const name: string = `Previous Sibling ${i} of ${this.name}`;
        const path: string = `${this.path}[preceding-sibling::${selector}][${i}]`;
        siblings.push(
          await PuppeteerElement.create(sibling, this._context, name, path)
        );
      }
    );
    return siblings;
  }

  public async getNextSibling(
    selector: string = "*"
  ): Promise<PuppeteerElement | iValue> {
    const siblings: ElementHandle[] = await this.$.$x(
      `following-sibling::${selector}`
    );
    const name: string = `Next Sibling of ${this.name}`;
    const path: string = `${this.path}[following-sibling::${selector}][0]`;
    if (siblings.length > 0) {
      return PuppeteerElement.create(siblings[0], this._context, name, path);
    }
    return this._wrapAsValue(null, name, this);
  }

  public async getNextSiblings(selector: string = "*"): Promise<iValue[]> {
    const siblingElements: ElementHandle[] = await this.$.$x(
      `following-sibling::${selector}`
    );
    const siblings: PuppeteerElement[] = [];
    await asyncForEach(
      siblingElements,
      async (sibling: ElementHandle, i: number) => {
        const name: string = `Next Sibling ${i} of ${this.name}`;
        const path: string = `${this.path}[following-sibling::${selector}][${i}]`;
        siblings.push(
          await PuppeteerElement.create(sibling, this._context, name, path)
        );
      }
    );
    return siblings;
  }

  protected async _getInnerText() {
    return String(await this._eval((e) => e.innerText, this.$));
  }

  protected async _getInnerHtml() {
    return String(await this._eval((e) => e.innerHTML, this.$));
  }

  protected async _getOuterHtml() {
    return String(await this._eval((e) => e.outerHTML, this.$));
  }

  public async getProperty(key: string): Promise<iValue> {
    const name: string = `${key} of ${this.name}`;
    const handle: JSHandle = await this._input.getProperty(key);
    return this._wrapAsValue(await handle.jsonValue(), name, this);
  }

  public async getData(key: string): Promise<iValue> {
    const name: string = `Data of ${this.name}`;
    const handle: JSHandle = await this._input.getProperty(key);
    return this._wrapAsValue(await handle.jsonValue(), name, this);
  }

  public async getValue(): Promise<iValue> {
    const name: string = `Value of ${this.name}`;
    const handle: JSHandle = await this._input.getProperty("value");
    return this._wrapAsValue(await handle.jsonValue(), name, this);
  }

  public async getText(): Promise<iValue> {
    const name: string = `Text of ${this.name}`;
    const handle: JSHandle = await this._input.getProperty("textContent");
    const text: string = String(await handle.jsonValue());
    return this._wrapAsValue(text, name, this);
  }

  public async getBounds(boxType: string = "border"): Promise<iBounds | null> {
    if (this._context.page == null) {
      throw new Error("Page is null.");
    }
    const allowedTypes: string[] = ["content", "padding", "border", "margin"];
    if (allowedTypes.indexOf(boxType) < 0) {
      throw new Error(
        `${boxType} is not a valid box type. Must be one of the following: ${allowedTypes.join(
          ", "
        )}.`
      );
    }
    const boxModel: BoxModel | null = await (this
      ._input as ElementHandle).boxModel();
    if (boxModel !== null) {
      return {
        x: boxModel[boxType][0].x,
        y: boxModel[boxType][0].y,
        width: boxModel.width,
        height: boxModel.height,
        points: boxModel[boxType],
      };
    }
    return null;
  }

  public async focus(): Promise<any> {
    if (this._context.page == null) {
      throw new Error("Page is null.");
    }
    await (this._input as ElementHandle).focus();
    this._completedAction("FOCUS");
  }

  public async blur(): Promise<any> {
    if (this._context.page == null) {
      throw new Error("Page is null.");
    }
    await (this._input as ElementHandle).evaluate((node) =>
      node.parentElement?.focus()
    );
    this._completedAction("BLUR");
  }

  public async hover(): Promise<void> {
    await (this._input as ElementHandle).hover();
    this._completedAction("HOVER");
  }

  public async tap(): Promise<void> {
    if (this._context.page == null) {
      throw new Error("Page is null.");
    }
    await (this._input as ElementHandle).tap();
    this._completedAction("TAP");
  }

  public async press(key: string, opts?: any): Promise<void> {
    if (this._context.page == null) {
      throw new Error("Page is null.");
    }
    await (this._input as ElementHandle).press(key, opts || {});
    this._completedAction("PRESS", key);
  }

  public async clearThenType(
    textToType: string,
    opts: any = {}
  ): Promise<void> {
    await this.clear();
    await this.type(textToType, opts);
  }

  public async type(textToType: string, opts: any = {}): Promise<void> {
    if (this._context.page == null) {
      throw new Error("Page is null.");
    }
    await (this._input as ElementHandle).type(textToType, opts);
    this._completedAction("TYPE", textToType);
  }

  public async clear(): Promise<void> {
    if (this._context.page == null) {
      throw new Error("Page is null.");
    }
    await (this._input as ElementHandle).click({ clickCount: 3 });
    await this._context.page.keyboard.press("Backspace");
    this._completedAction("CLEAR");
  }

  public async fillForm(
    attributeName: string,
    formData: KeyValue
  ): Promise<iValue>;
  public async fillForm(formData: KeyValue): Promise<iValue>;
  public async fillForm(a: string | KeyValue, b?: KeyValue): Promise<iValue> {
    const element: PuppeteerElement = this;
    const isForm: boolean = await this._isFormTag();
    if (this._context.page == null) {
      throw new Error("Page is null.");
    }
    if (!isForm) {
      throw new Error("This is not a form element.");
    }
    const page: Page | null = this._context.page;
    if (page === null) {
      throw new Error("Page is null");
    }
    const attributeName: string = typeof a === "string" ? a : "name";
    const formData: KeyValue = (typeof a === "string" ? b : a) || {};
    for (let name in formData) {
      const value: any = formData[name];
      const selector: string = `${element._path} [${attributeName}="${name}"]`;
      const inputs: ElementHandle[] = await page.$$(selector);
      if (inputs.length > 0) {
        const input: ElementHandle = inputs[0];
        const tagName: string = String(
          await (await input.getProperty("tagName")).jsonValue()
        ).toLowerCase();
        const inputType: string = String(
          await (await input.getProperty("type")).jsonValue()
        ).toLowerCase();
        // Some sites need you to focus on the element first
        await page.focus(selector);
        // Dropdowns
        if (tagName == "select") {
          await page.select(selector, value);
        }
        // Input boxes
        else if (tagName == "input") {
          // Radio or checkbox we need to click on the items
          if (inputType == "radio" || inputType == "checkbox") {
            // Turn it into an array, to support multiple checked boxes
            const multiValues: any[] =
              toType(value) == "array" ? value : [value];
            // Loop through each checkbox/radio element with this name
            for (let i = 0; i < inputs.length; i++) {
              let checkbox: ElementHandle = inputs[i];
              let isChecked: boolean = !!(await (
                await checkbox.getProperty("checked")
              ).jsonValue());
              let checkboxValue: string = String(
                await (await checkbox.getProperty("value")).jsonValue()
              );
              // Toggle it by clicking
              if (
                // This is one of our values, and it's not checked yet
                (multiValues.indexOf(checkboxValue) >= 0 && !isChecked) ||
                // This is not one of our values, but it is checked
                (multiValues.indexOf(checkboxValue) < 0 && isChecked)
              ) {
                await checkbox.click();
              }
            }
          } else if (
            inputType == "button" ||
            inputType == "submit" ||
            inputType == "reset"
          ) {
            // Do nothing for now (maybe should click??)
          } else {
            await this._context.clearThenType(selector, value);
          }
        }
        // Button elements
        else if (tagName == "button") {
          // Do nothing for now (maybe should click??)
        }
      }
      this._completedAction("FILL");
    }
    return this;
  }

  public async submit(): Promise<void>;
  public async submit(message: string): Promise<iScenario>;
  public async submit(callback: Function): Promise<iScenario>;
  public async submit(scenario: iScenario): Promise<iScenario>;
  public async submit(message: string, callback: Function): Promise<iScenario>;
  public async submit(
    a?: string | Function | iScenario,
    b?: Function
  ): Promise<iScenario | void> {
    if (!this._isFormTag()) {
      throw new Error("You can only use .submit() with a form element.");
    }
    if (this._context.page === null) {
      throw new Error("Page was null");
    }
    await this._context.page.evaluate((form) => form.submit(), this.$);
    this._completedAction("SUBMIT");
  }

  public async click(): Promise<void>;
  public async click(message: string): Promise<iScenario>;
  public async click(callback: Function): Promise<iScenario>;
  public async click(scenario: iScenario): Promise<iScenario>;
  public async click(message: string, callback: Function): Promise<iScenario>;
  public async click(
    a?: string | Function | iScenario,
    b?: Function
  ): Promise<void | iScenario> {
    this._completedAction("CLICK");
    // If they passed in a message or callback, treat this as a new sub-scenario
    if (a || b) {
      const overloaded = getMessageAndCallbackFromOverloading(a, b, this._path);
      return this._loadSubScenario(overloaded);
    }
    // Otherwise, just treat this as an inline click within the same scenario
    else {
      await (<ElementHandle>this._input).click();
    }
  }

  public screenshot(): Promise<Buffer>;
  public screenshot(localFilePath: string): Promise<Buffer>;
  public screenshot(
    localFilePath: string,
    opts: ScreenshotOpts
  ): Promise<Buffer>;
  public screenshot(opts: ScreenshotOpts): Promise<Buffer>;
  public screenshot(
    a?: string | ScreenshotOpts,
    b?: ScreenshotOpts
  ): Promise<Buffer> {
    const localFilePath = typeof a == "string" ? a : undefined;
    const opts: ScreenshotOpts = (typeof a !== "string" ? a : b) || {};
    return (<ElementHandle>this._input).screenshot({
      path: localFilePath || opts.path,
      encoding: "binary",
      omitBackground: opts.omitBackground || false,
    });
  }

  protected async _getClassName(): Promise<string> {
    const handle: JSHandle = await this._input.getProperty("className");
    return String(handle.jsonValue());
  }

  protected async _getTagName(): Promise<string> {
    const handle: JSHandle = await this._input.getProperty("tagName");
    const value: string = String(await handle.jsonValue());
    this._tagName = value.toLowerCase();
    return value;
  }

  protected _getSourceCode(): Promise<void> {
    return new Promise(async (resolve) => {
      const outerHtml: string = (await this.getOuterHtml()).toString();
      this._sourceCode = outerHtml;
      resolve();
    });
  }

  protected async _getAttribute(key: string): Promise<string> {
    const handle: JSHandle = await this._input.getProperty(key);
    return String(await handle.jsonValue());
  }

  protected async _eval(js: EvaluateFn<any>, arg?: any): Promise<any> {
    if (this._context.page !== null) {
      return await this._context.page.evaluate(js, arg);
    }
    throw new Error("Page was null.");
  }
}
