import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('tasks')
  createTask(@Body() taskDto: any) {
    return this.appService.createTask(taskDto);
  }

  @Get('tasks')
  findAllTasks() {
    return this.appService.findAllTasks();
  }

  @Post('users')
  createUser(@Body() userDto: any) {
    return this.appService.createUser(userDto);
  }

  @Get('users')
  findAllUsers() {
    return this.appService.findAllUsers();
  }
}
