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

  @MessagePattern('user.checkPassword')
  async checkPassword(
    @Payload() userData: { username: string; password: string },
  ) {
    return this.userService.checkPassword(userData);
  }

  @MessagePattern('user.createAccessToken')
  async createAccessToken(
    @Payload() userData: { username: string; password: string },
  ) {
    return this.userService.createAccessToken(userData);
  }

  @MessagePattern('user.verifyAccessToken')
  async verifyAccessToken(@Payload() token: string) {
    return this.userService.verifyAccessToken(token);
  }
}
