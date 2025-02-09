import socket
import json
from server_socket import ServerSocket
from rpc_access_controller import RpcAccessController

def main():
    config = json.load(open('../config.json'))
    socket_address_path =  "../" + config["filepath"]
    server_soccket = ServerSocket(socket_address_path)

    server_soccket.start_settion()

    while True:
        connection = server_soccket.accept_client()
        rpc_access_controller  = RpcAccessController()

        print("接続しました。")
        try:
            while True:
              print("==============================")
              rpc_access_controller.receive_response(connection)
              print("==============================")
        except socket.error as err:
           print(err)
           break
        
    server_soccket.close_settion(connection.close)
           

if __name__ == "__main__":
    main()