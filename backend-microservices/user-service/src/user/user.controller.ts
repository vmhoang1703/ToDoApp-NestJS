import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.get')
  async getUser(@Payload() username: string) {
    return this.userService.getUserByUsername(username);
  }

  @MessagePattern('user.create')
  async createUser(
    @Payload() userData: { username: string; password: string },
  ) {
    return this.userService.createUser(userData);
  }
}
