"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rxjs_1 = require("rxjs");
const crypto_1 = require("crypto");
const bodyParser = require("body-parser");
const xmlParser = require("wechat-xml-parser");
const uuid = require("uuid");
const wechat_1 = require("./wechat");
const interface_1 = require("../interface");
const parser_1 = require("./parser");
class WechatAdapter extends interface_1.Adapter {
    constructor(config) {
        super();
        this.config = config;
        this.sessionId = uuid.v4();
        this.parser = new parser_1.WechatParser(this.serverName(), this.sessionId);
        this.client = new wechat_1.Wechat(config.id, config.secret);
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
        return this.client.send(message.source.id, this.parser.format(message));
    }
    serverName() {
        return "wechat";
    }
    setRouter() {
        const router = express_1.Router();
        router.use(bodyParser.json()).use(xmlParser({ attrFormat: "lowerCase" }));
        router.get("/", (req, res, next) => {
            const shasum = crypto_1.createHash("sha1");
            shasum.update([this.config.token, req.query.timestamp, req.query.nonce].sort().join(""));
            const signature = shasum.digest("hex");
            if (signature !== req.query.signature)
                return res.status(403).end();
            res.status(200).send(req.query.echostr);
        }).post("/", (req, res, next) => {
            this.emitter.emit("message", req.body);
            // this.client.send("oXFfsv1N3Rfa5Cj0glsZTWUEjpYQ", "Hi")
            res.status(200).end();
        });
        return router;
    }
}
exports.WechatAdapter = WechatAdapter;
