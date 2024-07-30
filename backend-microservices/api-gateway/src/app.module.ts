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
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'api-gateway-consumer-client',
            allowAutoTopicCreation: true,
          },
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'api-gateway-consumer',
          },
        },
      },
      {
        name: 'TASK_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'task',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'api-gateway-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, UserController, TaskController],
  providers: [],
})
export class AppModule {}
