import { Express, Request, Response, Router } from 'express'
import { Observable } from 'rxjs'
import { createHash } from 'crypto'
import * as bodyParser from 'body-parser'
import * as xmlParser from 'wechat-xml-parser'
import * as uuid from 'uuid'

import { Wechat } from './wechat'
import { Adapter } from '../interface'
import { WechatParser } from './parser'
import { Bot, Config, Message, SendMessage } from '../model'

export class WechatAdapter extends Adapter {
    private client: Wechat

    constructor(private config: Config) {
        super()
        this.sessionId = uuid.v4()
        this.parser = new WechatParser(this.serverName(), this.sessionId)
        this.client = new Wechat(config.id, config.secret)
    }

    connect(): void {
        this.router = this.setRouter()
    }

    listen(): Observable<Bot> {
        return Observable.fromEvent(this.emitter as any, "message")
            .switchMap(value => {
                return Observable.of(value as Message)
                    .mergeMap(event => {
                        return Promise.resolve({
                            bot: this,
                            message: this.parser.parser(event)
                        })
                    })
                    .catch(err => Observable.of(err))
            })
    }

    send(message: SendMessage): Promise<any> {
        return this.client.send(message.source.id, this.parser.format(message))
    }

    serverName(): string {
        return "wechat"
    }

    private setRouter(): Router {
        const router: Router = Router()
        router.use(bodyParser.json()).use(xmlParser({ attrFormat: "lowerCase" }))
        router.get("/", (req, res, next) => {
            const shasum = createHash("sha1")
            shasum.update([this.config.token, req.query.timestamp, req.query.nonce].sort().join(""))
            const signature = shasum.digest("hex")
            if (signature !== req.query.signature)
                return res.status(403).end()
            res.status(200).send(req.query.echostr)
        }).post("/", (req, res, next) => {
            this.emitter.emit("message", req.body)

            // this.client.send("oXFfsv1N3Rfa5Cj0glsZTWUEjpYQ", "Hi")
            res.status(200).end()
        })

        return router
    }
}