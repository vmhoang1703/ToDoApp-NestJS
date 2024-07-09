import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(username: string, pass: string): Promise<any> {
    const saltOrRounds = 10;
    const passwordHashed = await bcrypt.hash(pass, saltOrRounds);
    const user = await this.usersService.findOne(username);
    if (user) {
      throw new ConflictException('Account already exists.');
    } else {
      await this.usersService.create(username, passwordHashed);
      return {
        message: 'Congratulation! Account has been created successfully.',
      };
    }
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
