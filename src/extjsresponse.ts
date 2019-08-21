import { PuppeteerResponse } from './puppeteerresponse';
import { ExtJsComponent } from './extjscomponent';
import { Scenario, iResponse, ResponseType, AssertionContext  } from '.';

export class ExtJSResponse extends PuppeteerResponse implements iResponse {

    public get typeName(): string {
        return 'ExtJS';
    }

    public get type(): ResponseType {
        return ResponseType.extjs;
    }

    constructor(scenario: Scenario) {
        super(scenario);
        // Before this scenario starts to run
        scenario.before(() => {
            scenario.nextPrepend(async (context: AssertionContext) => {
                if (context.page !== null) {
                    // Wait for HTML DOM
                    await context.assert(
                        'DOM Ready',
                        context.waitForNavigation(3000, 'domcontentloaded')
                    ).resolves();
                    // Wait for Ext
                    const extExists = `!!Ext`;
                    await context.page.waitForFunction(extExists);
                    await context.assert(
                        'Found Ext object.',
                        await context.page.evaluate(extExists)
                    ).equals(true);
                    // Wait for Ext ready
                    return context.assert(
                        'Ext.onReady fired',
                        context.waitForReady(15000)
                    ).resolves();
                }
            })
        })
    }

    /**
     * Select the first matching element
     * 
     * @param path 
     * @param findIn 
     */
    public async find(path: string): Promise<ExtJsComponent | null> {
        if (this.page !== null) {
            const componentReference: string = `flagpole_${Date.now()}_${path.replace(/[^a-z]/ig, '')}`;
            const queryToInject: string | undefined = `window.${componentReference} = Ext.ComponentQuery.query("${path}")[0];`;
            await this.page.addScriptTag({ content: queryToInject });
            // Build array of ExtJsComponent elements
            const exists: boolean = await this.page.evaluate(`!!window.${componentReference}`);
            if (exists) {
                return await ExtJsComponent.create(
                    componentReference,
                    this.context,
                    `${path}[0]`
                )
            }
            return null;
        }
        throw new Error('Cannot evaluate code becuase page is null.');
    }

    public async findAll(path: string): Promise<ExtJsComponent[]> {
        if (this.page !== null) {
            const componentReference: string = `flagpole_${Date.now()}_${path.replace(/[^a-z]/ig, '')}`;
            const queryToInject: string = `window.${componentReference} = Ext.ComponentQuery.query("${path}");`;
            await this.page.addScriptTag({ content: queryToInject });
            // Build array of ExtJsComponent elements
            const length: number = await this.page.evaluate(`window.${componentReference}.length`);
            let components: ExtJsComponent[] = [];
            for (let i = 0; i < length; i++) {
                components.push(
                    await ExtJsComponent.create(
                        `window.${componentReference}[${i}]`,
                        this.context,
                        `${path}[${i}]`
                    )
                )
            }
            return components;
        }
        throw new Error('Cannot evaluate code becuase page is null.');
    }

    public async waitForReady(timeout: number = 15000): Promise<void> {
        if (this.page !== null) {
            await this.page.evaluate(`Ext.onReady(() => { window.flagpoleExtReady = true; });`);
            await this.page.waitForFunction(`window.flagpoleExtReady`, { timeout: timeout });
            return;
        }
        return super.waitForReady(timeout);
    }

    public async typeText(selector: string, textToType: string, opts: any = {}): Promise<any> {
        if (this.page !== null) {
            const component: ExtJsComponent | null = await this.find(selector);
            if (component !== null) {
                component.fireEvent('focus');
                component.setValue(textToType);
                component.fireEvent('blur');
            }
            else {
                throw new Error(`Could not find component at ${selector}`);
            }
        }
        throw new Error(`Can not type into element ${selector}`);
    }

    public async clearValue(selector: string): Promise<any> {
        if (this.page !== null) {
            const component: ExtJsComponent | null = await this.find(selector);
            if (component !== null) {
                component.fireEvent('focus');
                component.setValue('');
                component.fireEvent('blur');
            }
            else {
                throw new Error(`Could not find component at ${selector}`);
            }
        }
        throw new Error(`Can not type into this element ${selector}`);
    }

}
