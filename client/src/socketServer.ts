import fs from "fs"
import net from "net"

export class SocketServer {
    client: net.Socket

    constructor(jsonPath: string){
        this.client = SocketServer.createSocketServer(jsonPath)
    }

    static createSocketServer(jsonPath: string){
        const jsonFile = fs.readFileSync(`../../${jsonPath}`, 'utf-8')
        const jsonData = JSON.parse(jsonFile)
    
        const socketAddress = "../../" + jsonData["filepath"]
    
        return net.createConnection(socketAddress)
    }

    onClose(){
        this.client.destroy()
        this.client.end()
        process.exit()
    }

    onErrorClose(){
        this.client.destroy()
        this.client.end()
        process.exit(1)
    }
}