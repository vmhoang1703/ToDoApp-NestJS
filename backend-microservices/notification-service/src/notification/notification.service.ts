import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  async sendDeadlineNotification(data: {
    userId: string;
    taskId: string;
    title: string;
  }) {
    this.notificationGateway.sendDeadlineNotification(data);
  }
}
