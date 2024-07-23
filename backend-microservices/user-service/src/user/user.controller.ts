import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.getProfile')
  async getUser(@Payload() username: string) {
    return this.userService.findOne(username);
  }

  @MessagePattern('user.create')
  async createUser(
    @Payload() userData: { username: string; password: string },
  ) {
    return this.userService.create(userData);
  }
}
