import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(username: string, passwordHashed: string): Promise<any> {
    const createdUser = new this.userModel({ username, password: passwordHashed });
    return createdUser.save();
  }

  async findOne(username: string): Promise<any> {
    return await this.userModel.findOne({ username }).exec();
  }
}
