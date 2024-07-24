import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  async register(createUserDto: any) {
    return this.authService.register(createUserDto);
  }

  @MessagePattern('auth.login')
  async login(
    @Payload() loginUserDto: any,
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    const response = await this.authService.login(loginUserDto);
    const originalMessage = context.getMessage();
    const responseTopic = originalMessage.headers['reply-topic'];
    const responsePartition = originalMessage.headers['reply-partition'];
    return {
      topic: responseTopic,
      partition: responsePartition,
      value: response,
    };
  }

  @MessagePattern('auth.verify')
  async verify(data: { token: string }) {
    return this.authService.verify(data.token);
  }
}
