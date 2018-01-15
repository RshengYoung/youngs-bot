"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cache = require("node-cache");
const axios_1 = require("axios");
const uuid = require("uuid");
class Wechat {
    constructor(appId, appSecret, sessionId) {
        this.wechatUrl = "https://api.weixin.qq.com/cgi-bin";
        this.getTokenUrl = this.wechatUrl + "/token?";
        this.sendMessageUrl = this.wechatUrl + "/message/custom/send?";
        this.sessionId = sessionId || uuid.v4();
        this.appId = appId;
        this.appSecret = appSecret;
        this.cache = new Cache({ stdTTL: 7000, checkperiod: 0 });
        let accessToken = this.cache.get(this.sessionId);
        if (!accessToken)
            this.getAccessToken().then(token => this.cache.set(this.sessionId, token));
    }
    send(userId, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${this.sendMessageUrl}access_token=`;
            const accessToken = this.cache.get(this.sessionId);
            const it = messagesIterator();
            if (accessToken) {
                url += accessToken;
                it.next();
            }
            else {
                this.getAccessToken().then(token => {
                    url += token;
                    this.cache.set(this.sessionId, token);
                    it.next();
                });
            }
            function sendMessage(message) {
                axios_1.default.post(url, format(userId, message)).then((result) => {
                    it.next();
                }).catch(err => console.log(err));
            }
            function* messagesIterator() {
                for (let index in messages)
                    yield sendMessage(messages[index]);
            }
            function format(userId, message) {
                const type = message.type.toLowerCase();
                if (type === "text") {
                    return {
                        touser: userId,
                        msgtype: type,
                        text: { content: message.text }
                    };
                }
                else if (type === "image") {
                    return {
                        touser: userId,
                        msgtype: type,
                        image: { media_id: message.image }
                    };
                }
                else if (type === "voice") {
                    return {
                        touser: userId,
                        msgtype: type,
                        voice: { media_id: message.voice }
                    };
                }
                else if (type === "video") {
                    return {
                        touser: userId,
                        msgtype: type,
                        video: {
                            media_id: message.video.mediaId,
                            thumb_media_id: message.video.thumbMediaId,
                            title: message.video.title,
                            description: message.video.description
                        }
                    };
                }
                else if (type === "music") {
                    return {
                        touser: userId,
                        msgtype: type,
                        music: {
                            title: message.music.title,
                            description: message.music.description,
                            musicurl: message.music.musicUrl,
                            hqmusicurl: message.music.hqMusicUrl,
                            thumb_media_id: message.music.mediaId
                        }
                    };
                }
                else if (type === "news") {
                    let format = {
                        touser: userId,
                        msgtype: type,
                        news: {
                            articles: []
                        }
                    };
                    message.news.articles.forEach(article => {
                        format.news.articles.push({
                            title: article.title,
                            description: article.description,
                            url: article.url,
                            picurl: article.image
                        });
                    });
                    return format;
                }
                else if (type === "mpnews") {
                    return {
                        touser: userId,
                        msgtype: type,
                        mpnews: { media_id: message.mpnews }
                    };
                }
                else if (type === "wxcard") {
                    return {
                        touser: userId,
                        msgtype: type,
                        card_id: message.wxcard
                    };
                }
                else if (type === "miniprogrampage") {
                    return {
                        touser: userId,
                        msgtype: type,
                        miniprogrampage: {
                            title: message.miniprogrampage.title,
                            appid: message.miniprogrampage.appId,
                            pagepath: message.miniprogrampage.pagepath,
                            thumb_media_id: message.miniprogrampage.mediaId
                        }
                    };
                }
            }
        });
    }
    getAccessToken() {
        console.log("Wechat: getAccessToken");
        const url = `${this.getTokenUrl}grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;
        return axios_1.default.get(url).then(result => Promise.resolve(result.data.access_token));
    }
}
exports.Wechat = Wechat;
class Message {
}
