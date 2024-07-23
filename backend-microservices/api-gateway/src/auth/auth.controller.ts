import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    return this.authClient.send('auth.login', loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authClient.send('auth.register', registerDto);
  }
}
