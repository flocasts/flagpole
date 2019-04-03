const Flagpole = require('../../dist/index.js').Flagpole;
const bluebird = require('bluebird');
const Promise = bluebird;

const suite = Flagpole.Suite('Test Scorecard UI')
    .base('https://floscorecard-staging.firebaseapp.com')
    .onDone(function (suite) {
        suite.print();
    });

const browserOpts = {
    headless: false,
    recordConsole: true,
    outputConsole: false,
    width: 1024,
    height: 768,
};

const login = suite.Scenario('Homepage')
    .browser(browserOpts)
    .open('/')
    .then((response) => {
        const scenario = response.scenario;
        const browser = scenario.getBrowser();

        // Run assertions
        response.status().equals(200);
    })
    // Login
    .then((response) => {
        const scenario = response.scenario;
        const browser = scenario.getBrowser();

        const page = browser.getPage();

        // Run assertions

        return Promise.mapSeries([
            () => page.type('input[name="username"]', 'scorecarduser@gmail.com'),
            () => page.type('input[name="password"]', 'FloSports2019'),
            () => page.click('button')
        ], (func) => func())
        .then(() => page.waitForNavigation({waitUntil: 'networkidle2'}))
        .then(() => {
            // TODO: Have a way to wait for the page to load after click.
            return new Promise(resolve => setTimeout(resolve, 5000));
        });
    })
    // Choose Sport
    .then((response) => {
        const scenario = response.scenario;
        const browser = scenario.getBrowser();

        const page = browser.getPage();

        // Run assertions
        return Promise.mapSeries([
            // () => page.$('a > span')
            // () => page.$$eval('a > span', span => span.filter(span => (span.textContent || '').indexOf('FloWrestling') > -1))
            // TODO: Replace this xpath with CSS selector and javascript. (page.$ or page.$$eval)
            () => page.$x('//span[contains(text(), "FloWrestling")]/parent::a')
            .then((elements) => {
                const anchor = elements[0];
                return anchor;
            })
            // .then((span) => span.$x('..')[0])
            .then((anchor) => anchor.click())
        ], (func) => func())
        .then(() => page.waitForNavigation({waitUntil: 'networkidle2'}))
        .then(() => {
            // TODO: Have a way to wait for the page to load after click.
            return new Promise(resolve => setTimeout(resolve, 5000));
        });
    })
    // Choose Event
    .then((response) => {
        const scenario = response.scenario;
        const browser = scenario.getBrowser();

        const page = browser.getPage();

        // Run assertions

        return Promise.mapSeries([
            // TODO: Replace this xpath with CSS selector and javascript. (page.$ or page.$$eval)
            () => page.$x('//span[contains(text(), "ALEX-WRESTLING-TEST")]/parent::a')
            .then((elements) => {
                const anchor = elements[0];
                return anchor;
            })
            .then((anchor) => anchor.click())
        ], (func) => func())
        .then(() => page.waitForNavigation({waitUntil: 'networkidle2'}))
        .then(() => {
            return new Promise(resolve => setTimeout(resolve, 5000));
        });
    })
    // Choose Stream
    .then((response) => {
        const scenario = response.scenario;
        const browser = scenario.getBrowser();

        const page = browser.getPage();

        // Run assertions

        return Promise.mapSeries([
            // TODO: Replace this xpath with CSS selector and javascript. (page.$ or page.$$eval)
            () => page.$x('//span[contains(text(), "ALEX-WRESTLING-TEST")]/parent::a')
            .then((elements) => {
                const anchor = elements[0];
                return anchor;
            })
            // .then((span) => span.$x('..')[0])
            .then((anchor) => anchor.click())
        ], (func) => func())
        .then(() => page.waitForNavigation({waitUntil: 'networkidle2'}))
        .then(() => {
            return new Promise(resolve => setTimeout(resolve, 5000));
        });
    })
    // Edit Wrestling Match data
    .then((response) => {
        const scenario = response.scenario;
        const browser = scenario.getBrowser();

        const page = browser.getPage();        
        // Run assertions

        return Promise.mapSeries([
            () => page.select('#style', 'greco'),
            () => page.evaluate(() => {document.querySelector('input#division').value = ''}),
            () => page.type('input[name="division"]', 'Scorecard Test'),
            () => page.evaluate(() => {document.querySelector('input#weight-class').value = ''}),
            () => page.type('input[name="weightClass"]', '65'),
            () => page.select('#weight-unit', 'kg'),
            () => page.evaluate(() => {document.querySelector('input#athlete1').value = ''}),
            () => page.type('input[name="athlete1"]', 'Alex Pierce'),
            () => page.evaluate(() => {document.querySelector('input#athlete2').value = ''}),
            () => page.type('input[name="athlete2"]', 'Matt Mulford'),
            // TODO: add a universal id if possible to the button so that we can clean this up
            () => page.click('body > flosco-app > main > flosco-wrestling-setup > div > form > div > div > button')
        ], (func) => func())
        .then(() => page.waitForNavigation({waitUntil: 'networkidle2'}))
        .then(() => {
            return new Promise(resolve => setTimeout(resolve, 5000));
        });
    })
    // End Bout
    .then((response) => {
        const scenario = response.scenario;
        const browser = scenario.getBrowser();

        const page = browser.getPage();

        // Run assertions

        return Promise.mapSeries([
            // TODO: Add ids to buttons so it is easier to target them
            // TODO: Replace this xpath with CSS selector and javascript. (page.$ or page.$$eval)
            () => page.$x("//button[contains(., 'End Bout')]")
            .then((elements) => {
                const anchor = elements[0];
                return anchor;
            })
            .then((anchor) => anchor.click())
        ], (func) => func());
    })
    .assertions((response) => {
        response.status().equals(200);
    });