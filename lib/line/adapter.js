"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rxjs_1 = require("rxjs");
const Line = require("@line/bot-sdk");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const interface_1 = require("../interface");
const parser_1 = require("./parser");
class LineAdapter extends interface_1.Adapter {
    constructor(config) {
        super();
        this.config = config;
        this.parser = new parser_1.LineParser(this.serverName(), uuid.v4());
        this.client = new Line.Client({
            channelSecret: config.secret,
            channelAccessToken: config.token
        });
    }
    connect() {
        this.router = this.setRouter();
    }
    listen() {
        return rxjs_1.Observable.fromEvent(this.emitter, "message")
            .switchMap(value => {
            return rxjs_1.Observable.of(value)
                .mergeMap(event => {
                return Promise.resolve({
                    bot: this,
                    message: this.parser.parser(event)
                });
            })
                .catch(err => rxjs_1.Observable.of(err));
        });
    }
    send(message) {
        // console.log(JSON.stringify(this.parser.format(message), null, 4))
        return this.client.pushMessage(message.source.id, this.parser.format(message));
    }
    serverName() {
        return "line";
    }
    setRouter() {
        const router = express_1.Router();
        router.use(Line.middleware({
            channelSecret: this.config.secret,
            channelAccessToken: this.config.token
        })).use(bodyParser.json()).use(bodyParser.urlencoded({ extended: false }));
        router.post("/", (req, res, next) => {
            const events = req.body.events;
            events.forEach(event => this.emitter.emit("message", event));
            res.status(200).send("OK");
        });
        return router;
    }
}
exports.LineAdapter = LineAdapter;
