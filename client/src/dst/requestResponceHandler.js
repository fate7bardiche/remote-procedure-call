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
    constructor(sock) {
        this.sock = sock;
        this.encoder = new TextEncoder();
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
        this.methodArgsTypes = new Map([
            ["floor", ["double", "double"]],
            ["nroot", ["int", "int"]],
            ["reverse", ["string"]],
            ["validAnagram", ["string", "string"]],
            ["sort", ["string[]"]],
        ]);
        this.methodDescriptions = new Map([
            ["floor", "floor(double x): x を最も近い整数に切り捨て、その結果を整数で返します。xは10進数です。"],
            ["nroot", "nroot(int n, int x): 方程式 rn = x における、r の値を計算します。"],
            ["reverse", "reverse(string s): 文字列sを逆にした新しい文字列を返します。"],
            ["validAnagram", "validAnagram(string str1, string str2): 2つの入力文字列が互いにアナグラムであるかどうかを示すブール値を返します。"],
            ["sort", "sort(string[] strArr): 文字列の配列をソートして、ソート後の文字列の配列を返します。昇順に並び替えられます。"],
        ]);
        this.sock = sock;
    }
    selectMethod() {
        return __awaiter(this, void 0, void 0, function* () {
            const methodKeyName = yield (0, prompts_1.select)({
                message: "実行したい関数を選択してください。",
                choices: [...this.methodNames.keys()].map((key) => {
                    return {
                        name: key,
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
            for (let i = 0; i < argsNum; i++) {
                const answer = yield (0, prompts_1.input)({ message: `${argsNum}個あるうちの${i + 1}つ目の引数を入力してください` });
                args.push(answer);
            }
            return args;
        });
    }
    startInputFlow() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const args = yield this.inputArgs(argsNum);
            const request = {
                method: methodName,
                params: args,
                param_types: this.methodArgsTypes.get(methodKeyName),
                id: crypto.randomUUID()
            };
            console.log("メソッドを実行します");
            this.sock.write(this.encoder.encode(JSON.stringify(request)));
        });
    }
}
exports.RequestResponseHandler = RequestResponseHandler;
