import { URL } from 'url';
import { iResponse } from "./response";
import { Flagpole } from ".";

const isValidDataUrl = require('valid-data-url');

export class Link {

    protected response: iResponse;
    protected uri: string;

    constructor(response: iResponse, uri: string) {
        this.response = response;
        this.uri = uri;
    }

    public getUri(queryString?: any): string {
        let baseUrl: URL = new URL(this.response.scenario.suite.buildUrl(this.response.scenario.getUrl() || ''));
        let thisUrl: URL = new URL(this.uri, baseUrl.href);
        if (queryString) {
            let type: string = Flagpole.toType(queryString);
            if (type == 'object') {
                for (let key in queryString) {
                    thisUrl.searchParams.append(key, queryString[key]);
                }
            }
            else if (type == 'array') {
                queryString.forEach(item => {
                    thisUrl.searchParams.append(item.name, item.value);
                });
            }
        }
        return thisUrl.href;
    }

    public isValidDataUri(): boolean {
        return isValidDataUrl(this.uri);
    }

    public isData(): boolean {
        return (/^data:/.test(this.uri));
    }

    public isAnchor(): boolean {
        return /^#/.test(this.uri);
    }

    public isEmail(): boolean {
        return /^mailto:/.test(this.uri)
    }

    public isPhone(): boolean {
        return /^(tel|callto|wtai):/.test(this.uri);
    }

    public isTextMessage(): boolean {
        return /^(sms|mms):/.test(this.uri);
    }

    public isGeo(): boolean {
        return /^(geo|geopoint):/.test(this.uri);
    }

    public isScript(): boolean {
        return /^(javascript):/.test(this.uri);
    }

    public isAppStore(): boolean {
        return /^(market|itms|itms-apps):/.test(this.uri);
    }

    public isFtp(): boolean {
        return /^(ftp):/.test(this.uri);
    }

    public isNonNavigation(): boolean {
        return /^(gopher|archie|veronica|telnet|file|nntp|news|irc|spdy|rtmp|rtp|tcp|udp):\/\//i.test(this.uri);
    }

    public isNavigation(): boolean {
        return (
            this.uri.length > 0 &&
            !this.isAnchor() &&
            (
                /^\?/.test(this.uri) ||
                /^https?:\/\//i.test(this.uri) ||
                /^\//i.test(this.uri) ||
                !/^[a-z-]{1,10}:/i.test(this.uri)
            )
        );
    }

    public validate(): Link {
        if (this.isAnchor()) {
            let anchorName: string = this.uri.substr(1);
            this.response.assert(
                this.response.getRoot()('a[name="' + anchorName + '"]').length > 0,
                'Anchor link has a matching anchor (' + anchorName + ')',
                'No anchor mathed the link (' + anchorName + ')'
            );
        }
        else if (this.isData()) {
            this.response.assert(
                this.isValidDataUri(),
                'Is valid data URL', 'Is not valid data URL'
            );
        }
        return this;
    }

}