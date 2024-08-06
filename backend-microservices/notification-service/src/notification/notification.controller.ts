import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('notification.deadline')
  async handleDeadlineNotification(
    @Payload() data: { userId: string; taskId: string; title: string },
  ) {
    await this.notificationService.sendDeadlineNotification(data);
  }
}
