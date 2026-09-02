import { io, Socket } from 'socket.io-client';

class SocketClient {
  private socket: Socket | null = null;
  private messageCallbacks: ((message: any) => void)[] = [];

  public connect(token: string) {
    if (!this.socket) {
      this.socket = io('http://localhost:8099', {
        query: { token }
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('message', (message: any) => {
        let msgObj = message;
        if (typeof message === 'string') {
          try {
            msgObj = JSON.parse(message);
          } catch (e) {
            console.error('Failed to parse socket message:', e);
          }
        }
        this.messageCallbacks.forEach(cb => cb(msgObj));
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public onMessage(callback: (message: any) => void) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }
}

export const socketClient = new SocketClient();
