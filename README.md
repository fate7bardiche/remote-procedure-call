# remote-procedure-call
RPCを用いて、クライアントがサーバーの関数を実行するプログラムです。

## 目次
- [使用技術](#使用技術)
  - [概要](#概要)
  - [環境構築](#環境構築)
    - [clone](#clone)
    - [パッケージのインストール](#パッケージのインストール)
    - [実行](#実行)
    - [(任意): TypeScriptファイルを編集した場合のコンパイル方法](#任意-typescriptファイルを編集した場合のコンパイル方法)
  - [使い方](#使い方)
    - [実行したい関数を選択](#実行したい関数を選択)
    - [引数を入力](#引数を入力)
    - [実行後](#実行後)
  - [使用中の画面キャプチャ](#使用中の画面キャプチャ)
    - [float関数の使い方](#float関数の使い方)
    - [sort関数の使い方](#sort関数の使い方)

## 使用技術
![Static Badge](https://img.shields.io/badge/-Python-F9DC3E.svg?style=flat&logo=python)： 3.10.12  
![Static Badge](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)：  v23.6.0  
![Static Badge](https://img.shields.io/badge/-Linux-FCC624?style=flat&logo=linux&logoColor=black)：Ubuntu 22.04  
## 概要
クライアントが関数名と引数を指定すると、サーバー側で該当する関数を実行し、レスポンスを返します。  
クライアントは、コマンドラインで関数を選択、引数を入力します。　　
サーバーは、複数のクライアントと同時に接続することができます。
エラーが起きた場合は、エラー用のレスポンスが返されます。  

## 環境構築
### clone
```
$ git clone git@github.com:fate7bardiche/remote-procedure-call.git
$ cd remote-procedure-call
```
### パッケージのインストール
```
$ pwd
> remote-procedure-call/client
$ npm install
```
### 実行
サーバー側とクライアント側は、別のタブで実行してください。  
先にサーバー側から実行します。
```
## サーバー側
$ pwd
> remote-procedure-call/server
$ python3 main.py
```
```
## クライアント側
$ pwd
> remote-procedure-call/client/src/dst
$ node main.js
```
### (任意): TypeScriptファイルを編集した場合のコンパイル方法
もう1つタブを開きます。
```
$ pwd
> remote-procedure-call/client
```
以下のいずれかを実行してください。

- 自動でコンパイルされるようにしたい場合
```
npm run watch
```
このタブを開いたままにすれば、tsファイルに変更があったときに自動でコンパイルします。  
- 手動でコンパイルする場合
```
npx tsc
```
## 使い方
サーバー側のタブ内を操作することはありません。  
クライアント側のタブから、指示に従って入力します。
### 実行したい関数を選択
キーボードの数字か、矢印キーを使用し、関数を選択します。  
下部に関数の説明が表示されます。

![スクリーンショット 2025-02-11 17 36 03](https://github.com/user-attachments/assets/a964e46e-3fd6-471d-8e0d-2c12fa02946b)


### 引数を入力
関数の説明に記載されていた通りの型を満たすような引数を入力してください。　　
- 引数が複数ある場合、第一引数から1つずつ入力します。  
![スクリーンショット 2025-02-11 17 40 12](https://github.com/user-attachments/assets/8a2e9b95-afbc-41c3-bc85-cb6681e10e6f)

- 引数の構文にエラーがある場合は、リクエストを投げる前にエラーを返します。　　
![スクリーンショット 2025-02-11 18 12 02](https://github.com/user-attachments/assets/676ef9b7-954f-4491-ae35-c1189e561330)

### 実行後
引数が入力し終わるとリクエストを投げます。 

- 正しく実行できれば、結果が返されます。  
![スクリーンショット 2025-02-11 17 41 43](https://github.com/user-attachments/assets/5c1b2344-b158-4ed1-a6d3-ef468d41d6ab)

- 正しく実行できなかった場合は、エラーが返されます。  
![スクリーンショット 2025-02-11 17 48 58](https://github.com/user-attachments/assets/3187727a-5ab2-47e5-8428-3f05a027fb08)

## 使用中の画面キャプチャ
### 関数の使用例
#### float関数の使い方
https://github.com/user-attachments/assets/5ab813c0-0998-4f7e-9c1b-d5eaf99414ae

#### sort関数の使い方
https://github.com/user-attachments/assets/d9eb64dc-d481-4c61-995f-6612288d6e90

### 複数クライアントとの接続
https://github.com/user-attachments/assets/26566b16-1951-4165-895f-07c680477160
