import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('TASKS_SERVICES') private readonly tasksClient: ClientProxy,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  createTask(taskDto: any) {
    return this.tasksClient.send('createTask', taskDto);
  }

  findAllTasks() {
    return this.tasksClient.send('findAllTasks', {});
  }

  createUser(userDto: any) {
    return this.usersClient.send('createUser', userDto);
  }

  findAllUsers() {
    return this.usersClient.send('findAllUsers', {});
  }
}
