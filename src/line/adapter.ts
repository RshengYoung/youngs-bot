import { Express, Request, Response, Router } from 'express'
import { Observable } from 'rxjs'
import * as Line from '@line/bot-sdk'
import * as bodyParser from 'body-parser'
import * as uuid from 'uuid'

import { Adapter } from '../interface'
import { LineParser } from './parser'
import { Bot, Config, Message, SendMessage } from '../model'
import { format } from 'url';

export class LineAdapter extends Adapter {
    private client: Line.Client

    constructor(private config: Config) {
        super()
        this.parser = new LineParser(this.serverName(), uuid.v4())
        this.client = new Line.Client({
            channelSecret: config.secret,
            channelAccessToken: config.token
        })
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
        // console.log(JSON.stringify(this.parser.format(message), null, 4))
        return this.client.pushMessage(message.source.id, this.parser.format(message))
    }

    serverName(): string {
        return "line"
    }

    private setRouter(): Router {
        const router: Router = Router()
        router.use(Line.middleware({
            channelSecret: this.config.secret,
            channelAccessToken: this.config.token
        })).use(bodyParser.json()).use(bodyParser.urlencoded({ extended: false }))
        router.post("/", (req, res, next) => {
            const events = req.body.events as Array<any>
            events.forEach(event => this.emitter.emit("message", event))
            res.status(200).send("OK")
        })
        return router
    }

}