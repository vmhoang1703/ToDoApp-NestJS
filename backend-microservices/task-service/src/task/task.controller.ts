import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern('task.getAll')
  async getAllTasks(@Payload() userId: string) {
    return this.taskService.getAllTasks(userId);
  }

  @MessagePattern('task.create')
  async createTask(
    @Payload()
    taskData: {
      userId: string;
      title: string;
      isCompleted: boolean;
    },
  ) {
    return this.taskService.createTask(taskData);
  }

  @MessagePattern('task.update')
  async updateTask(
    @Payload()
    payload: {
      taskId: string;
      updateTaskDto: { userId: string; title: string; isCompleted: boolean };
    },
  ) {
    const { taskId, updateTaskDto } = payload;
    return this.taskService.updateTask(taskId, updateTaskDto);
  }

  @MessagePattern('task.delete')
  async deleteTask(
    @Payload()
    taskId: string,
  ) {
    return this.taskService.deleteTask(taskId);
  }
}
