import { Observable } from 'rxjs'
import { Router } from 'express';
import { EventEmitter } from 'events'
import { connect } from 'net';

declare class Integration {
    line?: Adapter
    wechat?: Adapter
}
declare class HttpOption {
    host: string
    port: number
}
declare class Bot {
    bot: Adapter
    message: Message
}
declare class Config {
    id: string
    secret: string
    token: string
}
declare class Message {
    channel: {
        sessionId: string
        name: string
    }
    source: {
        id: string
        type: string
        replyToken?: string
        timeStamp: number
    }
    object: {
        type: string
        id?: string
        content?: string
        postback?: {
            data: string
            params?: {
                datetime: string
            }
        }
        location?: {
            title?: string
            address: string
            latitude: number
            longitude: number
        }
        sticker?: {
            packageId: string
            stickerId: string
        }
        image?: string
    }
}
declare class SendMessage {
    channel: {
        sessionId: string
        name: string
    }
    source: {
        id: string
        type: string
    }
    objects: MessageObject[]
}
declare class MessageObject {
    type: "text" | "image" | "audio" | "video" | "location" | "template"
    text?: string
    image?: {
        preview: string
        original: string
    }
    video?: {
        preview: string
        original: string
        title?: string
        description?: string
    }
    audio?: {
        source: string
        duration: number
    }
    location?: {
        title: string
        address: string
        latitude: number
        longitude: number
    }
    template?: {
        type: "buttons" | "confirm" | "carousel"
        tipText: string
        column?: Column
        columns?: Column[]
        text?: string
        actions?: Action[]
    }
}
declare class Column {
    image?: string
    title?: string
    text: string
    actions: Action[]
}

declare class Action {
    type: "postback" | "message" | "uri"
    label: string
    text?: string
    data?: string
    uri?: string
}

declare abstract class Adapter {
    constructor()
    abstract connect(): void
    abstract serverName(): string
    abstract listen(): Observable<Bot>
    abstract send(messages: SendMessage): Promise<any>

    getRouter(): Router

    protected parser: Parser
    protected emitter: EventEmitter
    protected ROUTER: Router
}

declare abstract class Parser {
    constructor(serverName: string, sessionId: string)

    abstract parser(event: any): Message
    abstract format(message: SendMessage): any[]

    protected serverName: string
    protected sessionId: string
}

declare class Botkit {
    constructor(option: HttpOption)
    use(integration: Adapter): Botkit
    listen(): void
    hear(): Observable<Bot>
}

declare class LineBot extends Adapter {
    constructor(config: Config)
    connect(): void
    listen(): Observable<Bot>
    send(message: SendMessage): Promise<any>
    serverName(): string
}

declare class WechatBot extends Adapter {
    constructor(config: Config)
    connect(): void
    listen(): Observable<Bot>
    send(message: SendMessage): Promise<any>
    serverName(): string
}