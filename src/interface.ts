import { Express, Request, Response, Router } from 'express'
import { Observable } from 'rxjs/observable'
import { EventEmitter } from 'events'

import { Bot, Message, SendMessage } from './model'

export abstract class Adapter {

    constructor() {
        this.router = Router()
        this.emitter = new EventEmitter()
    }

    abstract connect(): void
    abstract serverName(): string
    abstract listen(): Observable<Bot>
    abstract send(messages: SendMessage): Promise<any>

    getRouter(): Router {
        return this.router
    }

    getSessionId(): string {
        return this.sessionId
    }

    protected sessionId: string
    protected parser: Parser
    protected emitter: EventEmitter
    protected router: Router
}

export abstract class Parser {
    constructor(serverName: string, sessionId: string) {
        this.serverName = serverName
        this.sessionId = sessionId
    }

    abstract parser(event: any): Message
    abstract format(message: SendMessage): any[]

    protected serverName: string
    protected sessionId: string
}