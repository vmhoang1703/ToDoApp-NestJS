import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
    console.log(match);
    if (match) {
      return true;
    } else {
      return false;
    }
  }
}
