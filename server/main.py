import socket
import json
import threading
from server_socket import ServerSocket
from rpc_access_controller import RpcAccessController

def loop_handler(connection: socket):
     rpc_access_controller  = RpcAccessController()
     while True:
        print("==============================")
        rpc_access_controller.receive_response(connection)
        print("==============================")


def main():
    config = json.load(open('../config.json'))
    socket_address_path =  "../" + config["filepath"]
    server_soccket = ServerSocket(socket_address_path, 5)

    server_soccket.start_settion()

    clients = []
    while True:
        connection = server_soccket.accept_client()
        print("接続しました。")
        
        try:
           clients.append(connection)
           print(f"現在{len(clients)}個のクライアントと接続しています。")

           thread = threading.Thread(target=loop_handler, args=(connection, ), daemon=True)
           thread.start()
        except socket.error as err:
           print(err)
           break
        
    server_soccket.close_settion(connection.close)
           

if __name__ == "__main__":
    main()