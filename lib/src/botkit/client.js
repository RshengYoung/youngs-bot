"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const rxjs_1 = require("rxjs");
const R = require("ramda");
class Client {
    constructor(option) {
        this.option = option;
        this.app = Express();
        // private routers: Router[] = []
        this.integrations = [];
    }
    use(integration) {
        integration.connect();
        this.integrations.push(integration);
        const path = `/webhook/${integration.serverName()}`;
        console.log(`Server: ${path}`);
        this.app.use(path, integration.getRouter());
        return this;
    }
    listen() {
        this.app.listen(this.option.port, this.option.host);
    }
    hear() {
        return rxjs_1.Observable.merge(...R.map((integration) => integration.listen(), R.values(this.integrations)));
    }
}
exports.Client = Client;
