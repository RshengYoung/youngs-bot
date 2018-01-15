import * as R from 'ramda'
import * as Line from '@line/bot-sdk'

import { Parser } from '../interface'
import { Message, SendMessage } from '../model'

export class LineParser extends Parser {

    constructor(serverName: string, sessionId: string) {
        super(serverName, sessionId)
    }

    parser(event: any): Message {
        let message = this.normal(event)
        const type = R.path(["type"], event) as string
        const messageType = R.path(["message", "type"], event) as string
        message.object.type = type

        if (type.toLowerCase() === "message") {
            if (messageType.toLowerCase() === "text") {
                message.object.type = messageType
                message.object.content = R.path(["message", "text"], event) as string
            } else if (messageType.toLowerCase() === "image" || messageType.toLowerCase() === "video" || messageType.toLowerCase() === "audio") {
                message.object.type = messageType
                message.object.id = R.path(["message", "id"], event) as string
            } else if ((messageType.toLowerCase() === "location")) {
                message.object.location = {
                    title: R.path(["message", "title"], event) as string,
                    address: R.path(["message", "address"], event) as string,
                    latitude: R.path(["message", "latitude"], event) as number,
                    longitude: R.path(["message", "longitude"], event) as number
                }
            } else if (messageType.toLowerCase() === "sticker") {
                message.object.sticker = {
                    packageId: R.path(["message", "packageId"], event),
                    stickerId: R.path(["message", "stickerId"], event)
                }
            }
        } else if (type.toLowerCase() === "postback") {
            message.object.postback = R.path(["postback"], event)
        }
        return message
    }

    format(message: SendMessage): any[] {
        const objects = message.objects
        let format = []
        objects.forEach(object => {
            const type: string = object.type
            if (type === "text")
                format.push({ type: type, text: object.text })
            else if (type === "image") {
                format.push({
                    type: type,
                    originalContentUrl: object.image.original,
                    previewImageUrl: object.image.preview
                })
            } else if (type === "audio") {
                format.push({
                    type: type,
                    originalContentUrl: object.audio.source,
                    duration: object.audio.duration
                })
            } else if (type === "video") {
                format.push({
                    type: type,
                    originalContentUrl: object.video.original,
                    previewImageUrl: object.video.preview
                })
            } else if (type === "location") {
                const location = object.location
                format.push({ type, ...location })
            } else if (type === "template") {
                const templateType = object.template.type
                if (templateType === "buttons") {
                    format.push({
                        type: type,
                        altText: object.template.tipText,
                        template: {
                            type: templateType,
                            thumbnailImageUrl: object.template.column.image,
                            title: object.template.column.title,
                            text: object.template.column.text,
                            actions: object.template.column.actions
                        }
                    })
                } else if (templateType === "confirm") {
                    format.push({
                        type: type,
                        altText: object.template.tipText,
                        template: {
                            type: templateType,
                            text: object.template.text,
                            actions: object.template.actions
                        }
                    })
                } else if (templateType === "carousel") {
                    let template = {
                        type: type,
                        altText: object.template.tipText,
                        template: {
                            type: templateType,
                            columns: []
                        }
                    }
                    object.template.columns.forEach(col => {
                        template.template.columns.push({
                            thumbnailImageUrl: col.image,
                            title: col.title,
                            text: col.text,
                            actions: col.actions
                        })
                    })
                    format.push(template)
                }
            } else
                throw new Error("The type not be supported.")
        })

        return format
    }

    private normal(event: any): Message {
        let message: Message = {
            channel: {
                sessionId: this.sessionId,
                name: this.serverName
            },
            source: {
                type: event.source.type,
                id: (event.source.type == "user") ? event.source.userId : event.source.groupId,
                replyToken: event.replyToken,
                timeStamp: event.timestamp
            },
            object: {
                type: ""
            }
        }
        return message
    }
}