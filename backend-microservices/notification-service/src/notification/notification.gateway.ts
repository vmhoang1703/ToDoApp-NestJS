import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendDeadlineNotification(data: {
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
