import { Adapter } from './interface'

export class Integration {
    line?: Adapter
    wechat?: Adapter
}

export class Bot {
    bot: Adapter
    message: Message
}

export class HttpOption {
    host: string
    port: number
}

export class Config {
    id: string
    secret: string
    token: string
}

export class Message {
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

export class SendMessage {
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

class MessageObject {
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

class Column {
    image?: string
    title?: string
    text: string
    actions: Action[]
}

class Action {
    type: "postback" | "message" | "uri"
    label: string
    text?: string
    data?: string
    uri?: string
}