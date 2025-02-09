import socket
import os

class ServerSocket:
    def __init__ (self, socket_address_path: str):
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.socket_address_path = socket_address_path

    def start_settion(self):
        socket_address_path = self.socket_address_path

        try:
            os.unlink(socket_address_path)
        except:
            pass

        self.sock.bind(socket_address_path)
        self.sock.listen(1)
        print("接続待機中です。")

    def accept_client(self):
        connection, client_address = self.sock.accept()
        return connection

    def close_settion(self, on_close: callable):
        on_close()
        self.sock.close()