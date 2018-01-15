import { Botkit, LineBot, WechatBot, Integration } from '../src'
import { LINE, WECHAT } from './config'

import * as Express from 'express'
import * as bodyParser from 'body-parser'


const clients: Integration = {
    line: new LineBot(LINE),
    wechat: new WechatBot(WECHAT)
}

const bot = new Botkit({
    host: "localhost",
    port: 8080
})

bot.use(clients.line)
bot.use(clients.wechat)
bot.listen()

bot.hear().subscribe(opt => {    
    console.log(JSON.stringify(opt.message, null, 4))
    opt.bot.send({
        channel: opt.message.channel,
        source: {
            id: opt.message.source.id,
            type: opt.message.source.type
        },
        objects: [
            {
                type: "text",
                text: opt.message.object.content || "Hi~"
            },
            {
                type: "text",
                text: "How are you~?"
            }
        ]
    })

    // clients[mes.channel.name].send({
    //     channel: mes.channel,
    //     source: {
    //         id: mes.source.id,
    //         type: mes.source.type
    //     },
    //     objects: [
    //         {
    //             type: "text",
    //             text: mes.object.content || "Hi~"
    //         },
    //         {
    //             type: "image",
    //             image: {
    //                 original: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                 preview: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //             }
    //         },
    //         {
    //             type: "audio",
    //             audio: {
    //                 source: "https://storage.googleapis.com/paas-storage/audio/1-1_meal.m4a",
    //                 duration: 2000
    //             }
    //         },
    //         {
    //             type: "video",
    //             video: {
    //                 original: "https://storage.googleapis.com/paas-storage/video/1-1_meal.mp4",
    //                 preview: "https://storage.googleapis.com/paas-storage/image/1-1_meal.jpg"
    //             }
    //         },
    //         {
    //             type: "location",
    //             location: {
    //                 title: "台北科技大學",
    //                 address:"台北市大安區忠孝東路XXXXXX",
    //                 latitude: 25.042235,
    //                 longitude: 121.535478
    //             }
    //         }
    //     ]
    // })

    // clients[mes.channel.name].send({
    //     channel: mes.channel,
    //     source: {
    //         id: mes.source.id,
    //         type: mes.source.type
    //     },
    //     objects: [
    //         {
    //             type: "template",
    //             template: {
    //                 type: "buttons",
    //                 tipText: "This is buttons",
    //                 column: {
    //                     image: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                     title: "Title",
    //                     text: "Text",
    //                     actions: [
    //                         {
    //                             type: "message",
    //                             label: "Message",
    //                             text: "Hey"
    //                         },
    //                         {
    //                             type: "postback",
    //                             label: "Postback",
    //                             text: "Movie",
    //                             data: "data=postback"
    //                         },
    //                         {
    //                             type: "uri",
    //                             label: "Uri",
    //                             uri: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //                         }
    //                     ]
    //                 }
    //             }
    //         },
    //         {
    //             type: "template",
    //             template: {
    //                 type: "confirm",
    //                 tipText: "This is confirm",
    //                 text: "請確認",
    //                 actions: [
    //                     {
    //                         type: "message",
    //                         label: "Yes",
    //                         text: "Yes"
    //                     },
    //                     {
    //                         type: "message",
    //                         label: "No",
    //                         text: "no"
    //                     }
    //                 ]
    //             }
    //         },
    //         {
    //             type: "template",
    //             template: {
    //                 type: "carousel",
    //                 tipText: "This is carousel",
    //                 columns: [
    //                     {
    //                         image: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                         title: "Title",
    //                         text: "TEXT",
    //                         actions: [
    //                             {
    //                                 type: "message",
    //                                 label: "Message",
    //                                 text: "Hey"
    //                             },
    //                             {
    //                                 type: "postback",
    //                                 label: "Postback",
    //                                 text: "Movie",
    //                                 data: "data=postback"
    //                             },
    //                             {
    //                                 type: "uri",
    //                                 label: "Uri",
    //                                 uri: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         image: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                         title: "Title",
    //                         text: "TEXT",
    //                         actions: [
    //                             {
    //                                 type: "message",
    //                                 label: "Message",
    //                                 text: "Hey"
    //                             },
    //                             {
    //                                 type: "postback",
    //                                 label: "Postback",
    //                                 text: "Movie",
    //                                 data: "data=postback"
    //                             },
    //                             {
    //                                 type: "uri",
    //                                 label: "Uri",
    //                                 uri: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         image: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                         title: "Title",
    //                         text: "TEXT",
    //                         actions: [
    //                             {
    //                                 type: "message",
    //                                 label: "Message",
    //                                 text: "Hey"
    //                             },
    //                             {
    //                                 type: "postback",
    //                                 label: "Postback",
    //                                 text: "Movie",
    //                                 data: "data=postback"
    //                             },
    //                             {
    //                                 type: "uri",
    //                                 label: "Uri",
    //                                 uri: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         image: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                         title: "Title",
    //                         text: "TEXT",
    //                         actions: [
    //                             {
    //                                 type: "message",
    //                                 label: "Message",
    //                                 text: "Hey"
    //                             },
    //                             {
    //                                 type: "postback",
    //                                 label: "Postback",
    //                                 text: "Movie",
    //                                 data: "data=postback"
    //                             },
    //                             {
    //                                 type: "uri",
    //                                 label: "Uri",
    //                                 uri: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         image: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                         title: "Title",
    //                         text: "TEXT",
    //                         actions: [
    //                             {
    //                                 type: "message",
    //                                 label: "Message",
    //                                 text: "Hey"
    //                             },
    //                             {
    //                                 type: "postback",
    //                                 label: "Postback",
    //                                 text: "Movie",
    //                                 data: "data=postback"
    //                             },
    //                             {
    //                                 type: "uri",
    //                                 label: "Uri",
    //                                 uri: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         image: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                         title: "Title",
    //                         text: "TEXT",
    //                         actions: [
    //                             {
    //                                 type: "message",
    //                                 label: "Message",
    //                                 text: "Hey"
    //                             },
    //                             {
    //                                 type: "postback",
    //                                 label: "Postback",
    //                                 text: "Movie",
    //                                 data: "data=postback"
    //                             },
    //                             {
    //                                 type: "uri",
    //                                 label: "Uri",
    //                                 uri: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         image: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                         title: "Title",
    //                         text: "TEXT",
    //                         actions: [
    //                             {
    //                                 type: "message",
    //                                 label: "Message",
    //                                 text: "Hey"
    //                             },
    //                             {
    //                                 type: "postback",
    //                                 label: "Postback",
    //                                 text: "Movie",
    //                                 data: "data=postback"
    //                             },
    //                             {
    //                                 type: "uri",
    //                                 label: "Uri",
    //                                 uri: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         image: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                         title: "Title",
    //                         text: "TEXT",
    //                         actions: [
    //                             {
    //                                 type: "message",
    //                                 label: "Message",
    //                                 text: "Hey"
    //                             },
    //                             {
    //                                 type: "postback",
    //                                 label: "Postback",
    //                                 text: "Movie",
    //                                 data: "data=postback"
    //                             },
    //                             {
    //                                 type: "uri",
    //                                 label: "Uri",
    //                                 uri: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         image: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                         title: "Title",
    //                         text: "TEXT",
    //                         actions: [
    //                             {
    //                                 type: "message",
    //                                 label: "Message",
    //                                 text: "Hey"
    //                             },
    //                             {
    //                                 type: "postback",
    //                                 label: "Postback",
    //                                 text: "Movie",
    //                                 data: "data=postback"
    //                             },
    //                             {
    //                                 type: "uri",
    //                                 label: "Uri",
    //                                 uri: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         image: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg",
    //                         title: "Title",
    //                         text: "TEXT",
    //                         actions: [
    //                             {
    //                                 type: "message",
    //                                 label: "Message",
    //                                 text: "Hey"
    //                             },
    //                             {
    //                                 type: "postback",
    //                                 label: "Postback",
    //                                 text: "Movie",
    //                                 data: "data=postback"
    //                             },
    //                             {
    //                                 type: "uri",
    //                                 label: "Uri",
    //                                 uri: "https://i.ytimg.com/vi/mm_M7TE2qJ0/maxresdefault.jpg"
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         }
    //     ]
    // })


})