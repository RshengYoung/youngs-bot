import * as Cache from 'node-cache'
import axios from 'axios'
import * as uuid from 'uuid'
import * as R from 'ramda'

export class Wechat {
    private sessionId: string
    private appId: string
    private appSecret: string
    private cache: Cache

    private wechatUrl: string = "https://api.weixin.qq.com/cgi-bin"
    private getTokenUrl: string = this.wechatUrl + "/token?"
    private sendMessageUrl = this.wechatUrl + "/message/custom/send?"

    constructor(appId: string, appSecret: string, sessionId?: string) {
        this.sessionId = sessionId || uuid.v4()
        this.appId = appId
        this.appSecret = appSecret
        this.cache = new Cache({ stdTTL: 7000, checkperiod: 0 })

        let accessToken: string = this.cache.get(this.sessionId)
        if (!accessToken)
            this.getAccessToken().then(token => this.cache.set(this.sessionId, token))
    }

    async send(userId: string, messages: Message[]): Promise<any> {
        let url: string = `${this.sendMessageUrl}access_token=`
        const accessToken = this.cache.get(this.sessionId)
        const it = messagesIterator();
        if (accessToken) {
            url += accessToken
            it.next()
        } else {
            this.getAccessToken().then(token => {
                url += token
                this.cache.set(this.sessionId, token)
                it.next()
            })
        }

        function sendMessage(message: Message) {
            axios.post(url, format(userId, message)).then((result) => {
                it.next()
            }).catch(err => console.log(err))
        }

        function* messagesIterator() {
            for (let index in messages)
                yield sendMessage(messages[index])
        }

        function format(userId: string, message: Message): any {
            const type = message.type.toLowerCase()
            if (type === "text") {
                return {
                    touser: userId,
                    msgtype: type,
                    text: { content: message.text }
                }
            } else if (type === "image") {
                return {
                    touser: userId,
                    msgtype: type,
                    image: { media_id: message.image }
                }
            } else if (type === "voice") {
                return {
                    touser: userId,
                    msgtype: type,
                    voice: { media_id: message.voice }
                }
            } else if (type === "video") {
                return {
                    touser: userId,
                    msgtype: type,
                    video: {
                        media_id: message.video.mediaId,
                        thumb_media_id: message.video.thumbMediaId,
                        title: message.video.title,
                        description: message.video.description
                    }
                }
            } else if (type === "music") {
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
                }
            } else if (type === "news") {
                let format = {
                    touser: userId,
                    msgtype: type,
                    news: {
                        articles: []
                    }
                }
                message.news.articles.forEach(article => {
                    format.news.articles.push({
                        title: article.title,
                        description: article.description,
                        url: article.url,
                        picurl: article.image
                    })
                })
                return format
            } else if (type === "mpnews") {
                return {
                    touser: userId,
                    msgtype: type,
                    mpnews: { media_id: message.mpnews }
                }
            } else if (type === "wxcard") {
                return {
                    touser: userId,
                    msgtype: type,
                    card_id: message.wxcard
                }
            } else if (type === "miniprogrampage") {
                return {
                    touser: userId,
                    msgtype: type,
                    miniprogrampage: {
                        title: message.miniprogrampage.title,
                        appid: message.miniprogrampage.appId,
                        pagepath: message.miniprogrampage.pagepath,
                        thumb_media_id: message.miniprogrampage.mediaId
                    }
                }
            }
        }
    }

    getAccessToken(): Promise<string> {
        console.log("Wechat: getAccessToken")
        const url: string = `${this.getTokenUrl}grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`
        return axios.get(url).then(result => Promise.resolve(result.data.access_token))
    }
}

class Message {
    type: "text" | "image" | "voice" | "video" | "music" | "news" | "mpnews" | "wxcard" | "miniprogrampage"
    text?: string
    image?: string
    voice?: string
    video?: {
        mediaId: string
        thumbMediaId: string
        title: string
        description: string
    }
    music?: {
        title: string
        description: string
        musicUrl: string
        hqMusicUrl: string
        mediaId: string
    }
    news?: {
        articles: {
            title: string
            description: string
            url: string
            image: string
        }[]
    }
    mpnews?: string
    wxcard?: string
    miniprogrampage?: {
        title: string
        appId: string
        pagepath: string
        mediaId: string
    }
}