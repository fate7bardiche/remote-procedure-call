"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const fs_1 = __importDefault(require("fs"));
const net_1 = __importDefault(require("net"));
class SocketServer {
    constructor(jsonPath) {
        this.client = SocketServer.createSocketServer(jsonPath);
    }
    static createSocketServer(jsonPath) {
        const jsonFile = fs_1.default.readFileSync(`../../../${jsonPath}`, 'utf-8');
        const jsonData = JSON.parse(jsonFile);
        const socketAddress = "../../../" + jsonData["filepath"];
        return net_1.default.createConnection(socketAddress);
    }
    onClose() {
        this.client.destroy();
        this.client.end();
        process.exit();
    }
    onErrorClose() {
        this.client.destroy();
        this.client.end();
        process.exit(1);
    }
}
exports.SocketServer = SocketServer;
