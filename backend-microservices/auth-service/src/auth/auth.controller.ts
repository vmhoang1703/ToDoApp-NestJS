import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  async register(@Payload() createUserDto: any): Promise<any> {
    return this.authService.register(createUserDto);
  }

  @MessagePattern('auth.login')
  async login(@Payload() loginUserDto: any): Promise<any> {
    return this.authService.login(loginUserDto);
  }

  @MessagePattern('auth.verify')
  async verify(data: { token: string }) {
    return this.authService.verify(data.token);
  }
}
