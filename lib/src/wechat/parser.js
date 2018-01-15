"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const R = require("ramda");
const interface_1 = require("../interface");
class WechatParser extends interface_1.Parser {
    constructor(serverName, sessionId) {
        super(serverName, sessionId);
    }
    parser(event) {
        let message = this.normal(event);
        const type = R.path(["msgtype"], event);
        if (type.toLowerCase() === "text") {
            message.object.content = R.path(["content"], event);
        }
        else if (type.toLowerCase() === "image" || type.toLowerCase() === "voice" || type.toLowerCase() === "video" || type.toLowerCase() === "shortvideo") {
            message.object.id = R.path(["mdeiaid"], event);
        }
        else if (type.toLowerCase() === "location") {
            message.object.location = {
                address: R.path(["label"], event),
                latitude: parseFloat(R.path(["location_x"], event)),
                longitude: parseFloat(R.path(["location_y"], event))
            };
        }
        return message;
    }
    format(message) {
        const object = message.objects;
        let format = [];
        object.forEach(object => {
            const type = object.type.toLowerCase();
            if (type === "text")
                format.push({ type: type, text: object.text });
            else if (type === "image")
                format.push({ type: type, image: object.image.original });
            else if (type === "audio")
                format.push({ type: "voices", voice: object.audio.source });
            else if (type == "video") {
                format.push({
                    type: type,
                    video: {
                        mediaId: object.video.original,
                        thumbMediaId: object.video.original,
                        title: object.video.title,
                        description: object.video.description
                    }
                });
            }
            else if (type === "template") {
                let template = {
                    type: "news",
                    news: {
                        articles: []
                    }
                };
                object.template.columns.forEach(col => {
                    template.news.articles.push({
                        title: col.title,
                        description: col.text,
                        url: col.actions[0].uri,
                        image: col.image
                    });
                });
                format.push(template);
            }
        });
        return format;
    }
    normal(event) {
        let message = {
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
        };
        return message;
    }
}
exports.WechatParser = WechatParser;
