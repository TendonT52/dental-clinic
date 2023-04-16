import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthGuard } from './auth.guard';

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
    this.server.emit('onMessage', {
      message: 'New Message',
      content: body,
    });
  }
}
