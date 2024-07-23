import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  async register(@Payload() data: any) {
    return this.authService.register(data);
  }

  @MessagePattern('auth.login')
  async login(@Payload() data: any) {
    return this.authService.login(data);
  }

  @MessagePattern('auth.verify')
  async verify(@Payload() data: { token: string }) {
    return this.authService.verify(data.token);
  }
}
