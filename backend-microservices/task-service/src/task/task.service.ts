import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getAllTasks(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId: userId }).exec();
  }

  async createTask(taskData: {
    userId: string;
    title: string;
    status: string;
  }): Promise<Task> {
    const createdTask = new this.taskModel(taskData);
    return createdTask.save();
  }

  async updateTask(
    taskId: string,
    taskData: { userId: string; title: string; status: string },
  ): Promise<Task> {
    const updateTask = await this.taskModel
      .findByIdAndUpdate(taskId, taskData, { new: true })
      .exec();
    return updateTask;
  }

  async deleteTask(taskId: string): Promise<Task> {
    return this.taskModel.findByIdAndDelete(taskId).exec();
  }
}
