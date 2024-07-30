import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  // UseGuards
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
// import { AuthGuard } from 'src/auth/auth.guard';

@Controller('task')
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.taskClient.subscribeToResponseOf('task.getAll');
    this.taskClient.subscribeToResponseOf('task.create');
    this.taskClient.subscribeToResponseOf('task.update');
    this.taskClient.subscribeToResponseOf('task.delete');
    await this.taskClient.connect();
  }

  // @UseGuards(AuthGuard)
  @Get('')
  async getAllTasks(@Query('userId') userId: string) {
    return await firstValueFrom(this.taskClient.send('task.getAll', userId));
  }

  // @UseGuards(AuthGuard)
  @Post('')
  async createTask(@Body() createTaskDto: any) {
    return await firstValueFrom(
      this.taskClient.send('task.create', createTaskDto),
    );
  }

  @Put(':id')
  async updateTask(@Param('id') taskId: string, @Body() updateTaskDto: any) {
    return await firstValueFrom(
      this.taskClient.send('task.update', { taskId, updateTaskDto }),
    );
  }

  @Delete(':id')
  async deleteTask(@Param('id') taskId: string) {
    return await firstValueFrom(this.taskClient.send('task.delete', taskId));
  }
}
