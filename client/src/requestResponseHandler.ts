import net from "net"
import {  input, select} from "@inquirer/prompts"


export class RequestResponseHandler {
    private encoder = new TextEncoder()
    private decoder = new TextDecoder();
    private methodNames: Map<string, string> = new Map([
        ["floor", "floor"],
        ["nroot", "nroot"],
        ["reverse", "reverse"],
        ["validAnagram", "valid_anagram"],
        ["sort", "sort"]
    ])
    
    private methodArgsNums: Map<string, number> = new Map([
        ["floor", 1],
        ["nroot", 2],
        ["reverse", 1],
        ["validAnagram", 2],
        ["sort", 1],
    ]);
    
    private methodDescriptions: Map<string, string> = new Map([
        ["floor", "floor(double x): x を最も近い整数に切り捨て、その結果を整数で返します。xは10進数です。"],
        ["nroot", "nroot(int n, int x): 方程式 rn = x における、r の値を計算します。"],
        ["reverse", "reverse(string s): 文字列sを逆にした新しい文字列を返します。"],
        ["validAnagram", "validAnagram(string str1, string str2): 2つの入力文字列が互いにアナグラムであるかどうかを示すブール値を返します。"],
        ["sort", "sort(string[] strArr): 文字列の配列をソートして、ソート後の文字列の配列を返します。昇順に並び替えられます。"],
    ])

    constructor(public sock: net.Socket, private clientId: string){
        this.sock = sock
        this.clientId = clientId
    }

    async selectMethod() {
        const methodKeyName = await select({
            message: "実行したい関数を選択してください。",
            choices: [...this.methodNames.keys()].map((key, i) => {
                return {
                    name: `${i + 1}. ${key}`,
                    value: key,
                    description: this.methodDescriptions.get(key)
                }
            })
        })
        return methodKeyName
    }

    async inputArgs(argsNum: number) {
        const args: string[] = []
        const argsTypes: string[] = []
        for(let i = 0; i < argsNum ; i++){
            let answer: string
            let parsedArg:any
            while(true){
                answer = await input({message: `${argsNum}個あるうちの${i + 1}つ目の引数を入力してください`})
                console.log(answer, "が入力されました。")
                try {
                    parsedArg = JSON.parse(answer)
                    try {
                        RequestResponseHandler.validInput(parsedArg)
                        argsTypes.push(RequestResponseHandler.getArgsType(parsedArg, ""))
                        break
                    } catch (error) {
                        const e = error as Error
                        console.log(e.toString())
                    }
                } catch {
                    console.log("Syntaxが不正な文字列です。\n引数を入力しなおしてください。")
                }
            }
            args.push(parsedArg)
        }
        return [args, argsTypes]
    }

    static validInput(parsedArg: any){
        RequestResponseHandler.validArrayDepth(parsedArg, 0)
        RequestResponseHandler.validNumberOfTypes(parsedArg)
    }

    // 多次元の配列の場合、同じ深さにある各要素が持つ配列の深さが揃っていること検証する
    // 揃っていればパスする
    static validArrayDepth(inputArg: any, depth: number): number{
        if(!Array.isArray(inputArg)) return depth

        let currentDepth: number = RequestResponseHandler.validArrayDepth(inputArg[0], depth + 1)
        for(let i = 0; i < inputArg.length; i++){
            if(currentDepth != RequestResponseHandler.validArrayDepth(inputArg[i], depth + 1)){
                throw TypeError("要素の深度がすべて同じではありません。\n同じ深さにある要素はの型は揃えてください。\n['aa', 'bb'] -> OK, ['aa', ['bb']] -> NG")
            }
        }
        // 何も返さなくても動くが、戻り値の型的にとりあえずdepthを返している
        return depth
    }

    // 配列の中に、2種類以上の型が含まれていないことを検証する
    // 型が1種類だけであればパスする
    static validNumberOfTypes(inputArg: any): string{
        if(!Array.isArray(inputArg)) return typeof inputArg

        let arrayFirstItemType: string = RequestResponseHandler.validNumberOfTypes(inputArg[0]);
        for(let i = 1; i < inputArg.length; i++){
            if(arrayFirstItemType != RequestResponseHandler.validNumberOfTypes(inputArg[i])) {
                throw TypeError("配列に2種類以上のデータ型の要素が含まれています。データ型は1種類までにしてください。")
            }
        }
        return arrayFirstItemType
    }

    // シェルに入力した関数の引数の型を決めていく関数
    // シェルから入力したので、引数は初め必ずstringである
    // stringの文字列をパースし、型を調べていく
    // この関数は、オブジェクトに関してな配列以外が渡されることを考慮していない
    static getArgsType(arg: any, typeResult: string):string{
        if(!Array.isArray(arg)) {
            if(typeof arg == "number") return RequestResponseHandler.convertNumberToPrimitiveNumericType(arg) + typeResult
            return typeof arg + typeResult
        }
        return RequestResponseHandler.getArgsType(arg[0], typeResult + "[]" )
    }

    static convertNumberToPrimitiveNumericType(n: number):string{
        return Number.isInteger(n) ? "int" : "float"
    }

    async startInputFlow(){
        console.log("==================================")
        const methodKeyName = await this.selectMethod()
        const methodName = this.methodNames.get(methodKeyName)
        if(methodName == undefined) {
            console.log("メソッドが定義されていませんでした。")
            this.sock.end()
            process.exit(1)
        }

        const argsNum = this.methodArgsNums.get(methodKeyName)
        if(argsNum == undefined) {
            console.log("メソッドに必要な引数の数が定義されていませんでした。")
            this.sock.end()
            process.exit(1)
        }

        const [args, argsType] = await this.inputArgs(argsNum)

        const request = {
            method: methodName,
            params: args, 
            param_types: argsType,
            id: this.clientId
        }

        console.log("この内容でリクエストを送ります")
        console.log(request)
        this.sock.write(this.encoder.encode(JSON.stringify(request)))
    }

    writeResponseText(data: Buffer){
        console.log("〜〜〜レスポンスがありました。〜〜〜")
        const response = JSON.parse(this.decoder.decode(data))
        console.log(response)
        console.log()

        
        if(Object.keys(response).includes("error")) {
            console.log("エラーが発生しました")
            console.log(response["error"])
        }else {
            console.log("関数の実行結果は以下です。")
            console.log(response["results"])
        }
        console.log("==================================")

        console.log()
    }
}