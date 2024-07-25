import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('auth.register');
    this.authClient.subscribeToResponseOf('auth.login');
    await this.authClient.connect();
  }

  @Post('register')
  async register(@Body() createUserDto: any): Promise<any> {
    return await firstValueFrom(
      this.authClient.send('auth.register', createUserDto),
    );
  }

  @Post('login')
  async login(@Body() loginDto: any): Promise<any> {
    return await firstValueFrom(this.authClient.send('auth.login', loginDto));
  }
}
