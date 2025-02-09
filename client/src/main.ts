import crypto from "crypto"
import { RequestResponseHandler } from './requestResponseHandler';
import { SocketServer } from './socketServer';

const main = async() => {
    console.log("dashimasu")
    const sock = new SocketServer("config.json")
    const client = sock.client

    const requestResponseHandler = new RequestResponseHandler(client, crypto.randomUUID())

    requestResponseHandler.sock.on('connect', () => {
        console.log('接続しました')
        requestResponseHandler.startInputFlow()
    })
    requestResponseHandler.sock.on('data', (data) => {
        requestResponseHandler.writeResponseText(data)
        requestResponseHandler.startInputFlow()
    })
    requestResponseHandler.sock.on('error', (error) => {
        console.log("\n")
        console.log("エラーが起きたため、接続を終了しました")
        console.log(error.message)
        console.log(error.name)
        console.log(error.stack)
        sock.onErrorClose()
    });
    requestResponseHandler.sock.on('end', () => {
        console.log("\n")
        console.log("接続を終了しました")
        sock.onClose()
    });
}

main()
