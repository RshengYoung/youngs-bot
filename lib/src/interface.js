"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const events_1 = require("events");
class Adapter {
    constructor() {
        this.router = express_1.Router();
        this.emitter = new events_1.EventEmitter();
    }
    getRouter() {
        return this.router;
    }
}
exports.Adapter = Adapter;
class Parser {
    constructor(serverName, sessionId) {
        this.serverName = serverName;
        this.sessionId = sessionId;
    }
}
exports.Parser = Parser;
