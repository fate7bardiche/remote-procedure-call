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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestResponseHandler = void 0;
const prompts_1 = require("@inquirer/prompts");
class RequestResponseHandler {
    constructor(sock, clientId) {
        this.sock = sock;
        this.clientId = clientId;
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
        this.methodNames = new Map([
            ["floor", "floor"],
            ["nroot", "nroot"],
            ["reverse", "reverse"],
            ["validAnagram", "valid_anagram"],
            ["sort", "sort"]
        ]);
        this.methodArgsNums = new Map([
            ["floor", 1],
            ["nroot", 2],
            ["reverse", 1],
            ["validAnagram", 2],
            ["sort", 1],
        ]);
        this.methodDescriptions = new Map([
            ["floor", "floor(double x): x を最も近い整数に切り捨て、その結果を整数で返します。xは10進数です。"],
            ["nroot", "nroot(int n, int x): 方程式 rn = x における、r の値を計算します。"],
            ["reverse", "reverse(string s): 文字列sを逆にした新しい文字列を返します。"],
            ["validAnagram", "validAnagram(string str1, string str2): 2つの入力文字列が互いにアナグラムであるかどうかを示すブール値を返します。"],
            ["sort", "sort(string[] strArr): 文字列の配列をソートして、ソート後の文字列の配列を返します。昇順に並び替えられます。"],
        ]);
        this.sock = sock;
        this.clientId = clientId;
    }
    selectMethod() {
        return __awaiter(this, void 0, void 0, function* () {
            const methodKeyName = yield (0, prompts_1.select)({
                message: "実行したい関数を選択してください。",
                choices: [...this.methodNames.keys()].map((key, i) => {
                    return {
                        name: `${i + 1}. ${key}`,
                        value: key,
                        description: this.methodDescriptions.get(key)
                    };
                })
            });
            return methodKeyName;
        });
    }
    inputArgs(argsNum) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = [];
            const argsTypes = [];
            for (let i = 0; i < argsNum; i++) {
                let answer;
                while (true) {
                    answer = yield (0, prompts_1.input)({ message: `${argsNum}個あるうちの${i + 1}つ目の引数を入力してください` });
                    console.log(answer, "が入力されました。");
                    try {
                        const parsedArg = JSON.parse(answer);
                        try {
                            RequestResponseHandler.validInput(parsedArg);
                            argsTypes.push(RequestResponseHandler.getArgsType(parsedArg, ""));
                            break;
                        }
                        catch (error) {
                            const e = error;
                            console.log(e.toString());
                        }
                    }
                    catch (_a) {
                        console.log("Syntaxが不正な文字列です。\n引数を入力しなおしてください。");
                    }
                }
                args.push(answer);
            }
            return [args, argsTypes];
        });
    }
    // static validInput(inputArg: any){
    //     if(!Array.isArray(inputArg)) return
    //     RequestResponseHandler.validArrayInput(inputArg, 0, inputArg.length - 1)
    // }
    // static validArrayInput(inputArg: any, start: number, end: number): string{
    //     if (start == end) {
    //         if(Array.isArray(inputArg)){
    //             RequestResponseHandler.validArrayInput(inputArg, 0, inputArg.length - 1)
    //         } else {
    //             return typeof inputArg
    //         }
    //     } 
    //     const middle = Math.floor((start + end) / 2)
    //     const type1 = RequestResponseHandler.validArrayInput(inputArg, start, middle)
    //     const type2 = RequestResponseHandler.validArrayInput(inputArg, middle, end)
    //     if(type1 != type2 ) throw TypeError("配列に2種類以上のデータ型の要素が含まれています。データ型は1種類までにしてください。")
    //     return type1
    // }
    static validInput(inputArg) {
        if (!Array.isArray(inputArg))
            return typeof inputArg;
        let arrayFirstItemType = RequestResponseHandler.validInput(inputArg[0]);
        for (let i = 1; i < inputArg.length; i++) {
            if (arrayFirstItemType != RequestResponseHandler.validInput(inputArg[i]))
                throw TypeError("配列に2種類以上のデータ型の要素が含まれています。データ型は1種類までにしてください。");
        }
        return arrayFirstItemType;
    }
    // シェルに入力した関数の引数の型を決めていく関数
    // シェルから入力したので、引数は初め必ずstringである
    // stringの文字列をパースし、型を調べていく
    // static getArgsTypeList(args: string[]): string[]{
    //     const argsTypes: string[] = []
    //     for(let i = 0; i < args.length; i++){
    //         const parsedArg = JSON.parse(args[i])
    //         argsTypes.push(RequestResponseHandler.getArgsType(parsedArg, ""))
    //     }
    //     return argsTypes
    // }
    // オブジェクトは配列以外、考慮されていない。
    static getArgsType(arg, typeResult) {
        if (!Array.isArray(arg)) {
            if (typeof arg == "number")
                return RequestResponseHandler.convertNumberToPrimitiveNumericType(arg) + typeResult;
            return typeof arg + typeResult;
        }
        return RequestResponseHandler.getArgsType(arg[0], typeResult + "[]");
    }
    static convertNumberToPrimitiveNumericType(n) {
        return Number.isInteger(n) ? "int" : "float";
    }
    startInputFlow() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("==================================");
            const methodKeyName = yield this.selectMethod();
            const methodName = this.methodNames.get(methodKeyName);
            if (methodName == undefined) {
                console.log("メソッドが定義されていませんでした。");
                this.sock.end();
                process.exit(1);
            }
            const argsNum = this.methodArgsNums.get(methodKeyName);
            if (argsNum == undefined) {
                console.log("メソッドに必要な引数の数が定義されていませんでした。");
                this.sock.end();
                process.exit(1);
            }
            const [args, argsType] = yield this.inputArgs(argsNum);
            const request = {
                method: methodName,
                params: args,
                param_types: argsType,
                id: this.clientId
            };
            console.log("この内容でリクエストを送ります");
            console.log(request);
            this.sock.write(this.encoder.encode(JSON.stringify(request)));
        });
    }
    writeResponseText(data) {
        console.log("〜〜〜レスポンスがありました。〜〜〜");
        const response = JSON.parse(this.decoder.decode(data));
        console.log(response);
        console.log();
        if (Object.keys(response).includes("error")) {
            console.log("エラーが発生しました");
            console.log(response["error"]);
        }
        else {
            console.log("関数の実行結果は以下です。");
            console.log(response["results"]);
        }
        console.log("==================================");
        console.log();
    }
}
exports.RequestResponseHandler = RequestResponseHandler;
