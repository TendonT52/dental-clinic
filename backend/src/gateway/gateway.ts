import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthGuard, getUserId } from './auth.guard';

@WebSocketGateway()
export class MyGateWay implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      const token = socket.handshake.headers.access_token;
      if (!token) {
        socket.disconnect();
      }
      console.log('Client connected: ', socket.id);
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    const { userID, role, roomId } = getUserId();
    this.server.emit(roomId.toString(), {
      message: `Sent From userId: ${userID}, role: ${role}, roomId: ${roomId}`,
      content: body,
    });
  }
}
