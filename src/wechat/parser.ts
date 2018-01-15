import * as R from 'ramda'

import { Parser } from '../interface'
import { Message, SendMessage } from '../model'

export class WechatParser extends Parser {

    constructor(serverName: string, sessionId: string) {
        super(serverName, sessionId)
    }

    parser(event: any): Message {
        let message = this.normal(event)
        const type = R.path(["msgtype"], event) as string
        if (type.toLowerCase() === "text") {
            message.object.content = R.path(["content"], event) as string
        } else if (type.toLowerCase() === "image" || type.toLowerCase() === "voice" || type.toLowerCase() === "video" || type.toLowerCase() === "shortvideo") {
            message.object.id = R.path(["mdeiaid"], event) as string
        } else if (type.toLowerCase() === "location") {
            message.object.location = {
                address: R.path(["label"], event) as string,
                latitude: parseFloat(R.path(["location_x"], event) as string),
                longitude: parseFloat(R.path(["location_y"], event) as string)
            }
        }
        return message
    }

    format(message: SendMessage): any[] {
        const object = message.objects
        let format = []
        object.forEach(object => {
            const type: string = object.type.toLowerCase()
            if (type === "text")
                format.push({ type: type, text: object.text })
            else if (type === "image")
                format.push({ type: type, image: object.image.original })
            else if (type === "audio") 
                format.push({ type: "voices", voice: object.audio.source })
            else if (type == "video") {
                format.push({
                    type: type,
                    video: {
                        mediaId: object.video.original,
                        thumbMediaId: object.video.original,
                        title: object.video.title,
                        description: object.video.description
                    }
                })
            } else if (type === "template") {
                let template = {
                    type: "news",
                    news: {
                        articles: []
                    }
                }
                object.template.columns.forEach(col => {
                    template.news.articles.push({
                        title: col.title,
                        description: col.text,
                        url: col.actions[0].uri,
                        image: col.image
                    })
                })
                format.push(template)
            }

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
                type: "user",
                id: event.fromusername,
                replyToken: event.msgid,
                timeStamp: event.createtime
            },
            object: {
                type: event.msgtype
            }
        }
        return message
    }
}