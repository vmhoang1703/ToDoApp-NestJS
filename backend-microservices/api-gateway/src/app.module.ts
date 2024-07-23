import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { TaskController } from './task/task.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['kafka:9093'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: ['kafka:9093'],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
      {
        name: 'TASK_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'task',
            brokers: ['kafka:9093'],
          },
          consumer: {
            groupId: 'task-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, UserController, TaskController],
  providers: [],
})
export class AppModule {}
