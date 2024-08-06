import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway()
export class NotificationService {
  @WebSocketServer()
  server: Server;

  async sendDeadlineNotification(data: {
    userId: string;
    taskId: string;
    title: string;
  }) {
    this.server.to(data.userId).emit('deadline_notification', {
      taskId: data.taskId,
      message: `Task "${data.title}" is due soon!`,
    });
  }
}
