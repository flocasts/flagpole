import { Suite } from "./suite";
import { ConsoleLine } from "./consoleline";
import { ResponseType, SimplifiedResponse } from "./response";
export declare class Scenario {
    readonly suite: Suite;
    protected title: string;
    protected log: Array<ConsoleLine>;
    protected failures: Array<string>;
    protected passes: Array<string>;
    protected onDone: Function;
    protected initialized: number | null;
    protected start: number | null;
    protected end: number | null;
    protected requestStart: number | null;
    protected requestLoaded: number | null;
    protected responseType: ResponseType;
    protected url: string | null;
    protected waitToExecute: boolean;
    protected nextLabel: string | null;
    protected flipAssertion: boolean;
    protected optionalAssertion: boolean;
    protected ignoreAssertion: boolean;
    protected _then: Function | null;
    protected _isMock: boolean;
    protected options: any;
    constructor(suite: Suite, title: string, onDone: Function);
    failed(): boolean;
    passed(): boolean;
    jsonBody(jsonObject: any): Scenario;
    body(str: string): Scenario;
    proxy(proxyUri: string): Scenario;
    timeout(timeout: number): Scenario;
    wait(bool?: boolean): Scenario;
    form(form: {}): Scenario;
    maxRedirects(n: number): Scenario;
    followRedirect(onRedirect: boolean | Function): Scenario;
    auth(authorization: {
        username: string;
        password: string;
    }): Scenario;
    headers(headers: {}): Scenario;
    header(key: string, value: any): Scenario;
    method(method: string): Scenario;
    isDone(): boolean;
    subheading(message: string): Scenario;
    comment(message: string): Scenario;
    assert(statement: boolean, message: string, actualValue?: string): Scenario;
    pass(message: string): Scenario;
    fail(message: string, isOptional?: boolean): Scenario;
    protected reset(): Scenario;
    not(): Scenario;
    optional(): Scenario;
    ignore(assertions?: boolean | Function): Scenario;
    protected executeWhenReady(): void;
    open(url: string): Scenario;
    then(callback: Function): Scenario;
    assertions(callback: Function): Scenario;
    skip(message?: string): Scenario;
    protected getScenarioType(): {
        name: string;
        responseObject;
    };
    protected processResponse(simplifiedResponse: SimplifiedResponse): void;
    protected executeRequest(): void;
    protected executeMock(): void;
    execute(): Scenario;
    mock(localPath: string): Scenario;
    label(message: string): Scenario;
    getLog(): Array<ConsoleLine>;
    protected getExecutionTime(): number;
    done(): Scenario;
    getUrl(): string | null;
    getRequestLoadTime(): number | null;
    canExecute(): boolean;
    hasExecuted(): boolean;
    hasFinished(): boolean;
    protected setResponseType(type: ResponseType): Scenario;
    image(): Scenario;
    html(): Scenario;
    json(): Scenario;
    script(): Scenario;
    stylesheet(): Scenario;
    resource(): Scenario;
}
