import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Role } from '@prisma/client';
import { Server } from 'socket.io';
import { Auth } from 'src/auth/roles.decorator';

@WebSocketGateway()
export class MyGateWay implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  @Auth(Role.PATIENT, Role.DENTIST, Role.ADMIN)
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Client connected: ', socket.id);
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  @Auth(Role.PATIENT, Role.DENTIST, Role.ADMIN)
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('onMessage', {
      message: 'New Message',
      content: body,
    });
  }
}
