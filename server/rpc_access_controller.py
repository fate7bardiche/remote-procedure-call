from method_dictionary import method_dict
import socket
import json

class RpcAccessController:
    def receive_response(self, connection: socket):
        print("- リクエストを待っています。")
        data = connection.recv(1024)
        json_data = json.loads(data.decode())

        print("- 以下のリクエストを受け付けました。")
        print(json_data)
        print()

        client_id = str(json_data["id"])

        method_name = str(json_data["method"])
        method = method_dict[method_name]

        if method == None:
            connection.sendall(json.dumps(self.create_error_response(client_id, 'サーバーにメソッドが用意されていませんでした。')).encode())
            return
        
        try:
            result = method(json_data["params"], json_data["param_types"])
        except Exception as e:
            print("- エラーレスポンスを返します。")
            connection.sendall(json.dumps(self.create_error_response(client_id, e )).encode())
            return

        response = self.create_success_response(client_id, result)
        print("- 以下のレスポンスを返します。")
        print(response)
        connection.sendall(json.dumps(response).encode())

    def create_success_response(self, id, result):
        return {
            "id": id,
            "results": result,
            "result_type": type(result).__name__,
        }

    def create_error_response(self, id, error):
        return {
            "id": id,
            "error": str(error)
        }
