import * as Express from 'express'
import { Observable } from 'rxjs'
import * as R from 'ramda'

import { Adapter } from '../interface'
import { Bot, HttpOption, Message, SendMessage } from '../model'

export class Client {
    private app = Express()
    // private routers: Router[] = []
    private integrations: Adapter[] = []

    constructor(private option: HttpOption) {
        
    }

    use(integration: Adapter): Client {
        integration.connect()
        this.integrations.push(integration)
        const path: string = `/webhook/${integration.serverName()}`
        console.log(`Server: ${path}`)
        this.app.use(path, integration.getRouter())
        return this
    }

    listen(): void {
        this.app.listen(this.option.port, this.option.host)
    }

    hear(): Observable<Bot> {
        return Observable.merge(...R.map((integration: any) => integration.listen(), R.values(this.integrations)))
    }

    // send(message: MessageObject[]): Promise<any> {

    //     return Promise.resolve()
    // }
}