"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const requestResponseHandler_1 = require("./requestResponseHandler");
const socketServer_1 = require("./socketServer");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dashimasu");
    const sock = new socketServer_1.SocketServer("config.json");
    const client = sock.client;
    const requestResponseHandler = new requestResponseHandler_1.RequestResponseHandler(client, crypto_1.default.randomUUID());
    requestResponseHandler.sock.on('connect', () => {
        console.log('接続しました');
        requestResponseHandler.startInputFlow();
    });
    requestResponseHandler.sock.on('data', (data) => {
        requestResponseHandler.writeResponseText(data);
        requestResponseHandler.startInputFlow();
    });
    requestResponseHandler.sock.on('error', (error) => {
        console.log("\n");
        console.log("エラーが起きたため、接続を終了しました");
        console.log(error.message);
        console.log(error.name);
        console.log(error.stack);
        sock.onErrorClose();
    });
    requestResponseHandler.sock.on('end', () => {
        console.log("\n");
        console.log("接続を終了しました");
        sock.onClose();
    });
});
main();
