import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile() {
    return this.userClient.send('user.get_profile', {});
  }
}
