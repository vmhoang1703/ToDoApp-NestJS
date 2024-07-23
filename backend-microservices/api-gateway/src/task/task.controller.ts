import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller('task')
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskClient: ClientKafka,
  ) {}

  @Get()
  async getTasks() {
    return this.taskClient.emit('task.get', {});
  }
}
