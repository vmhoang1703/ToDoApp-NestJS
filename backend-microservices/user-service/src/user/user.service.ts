import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUserByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  async createUser(userData: {
    username: string;
    password: string;
  }): Promise<User> {
    const passwordHashed = await bcrypt.hash(userData.password, 10);
    userData.password = passwordHashed;
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async checkPassword(userData: {
    username: string;
    password: string;
  }): Promise<boolean> {
    const user = await this.userModel
      .findOne({ username: userData.username })
      .exec();
    const match = await bcrypt.compare(userData.password, user.password);
    if (match) {
      return true;
    } else {
      return false;
    }
  }

  async createAccessToken(userData: { username: string; password: string }) {
    const user = await this.userModel
      .findOne({ username: userData.username })
      .exec();
    const payload = { userId: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyAccessToken(token: string) {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid token.');
    }
  }
}
