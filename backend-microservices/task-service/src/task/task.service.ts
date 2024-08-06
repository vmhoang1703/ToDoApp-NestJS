import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.notificationClient.subscribeToResponseOf('notification.deadline');
    await this.notificationClient.connect();
  }

  async getAllTasks(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId: userId }).exec();
  }

  async createTask(taskData: Task): Promise<Task> {
    const createdTask = new this.taskModel(taskData);
    const savedTask = await createdTask.save();
    // const taskId = savedTask._id as unknown as string;
    // this.scheduleDeadlineNotification(taskId, savedTask);
    return savedTask;
  }

  async updateTask(taskId: string, taskData: Task): Promise<Task> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(taskId, taskData, { new: true })
      .exec();
    // this.scheduleDeadlineNotification(taskId, updatedTask);
    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<Task> {
    return this.taskModel.findByIdAndDelete(taskId).exec();
  }

  // private scheduleDeadlineNotification(taskId: string, task: Task) {
  //   const now = new Date();
  //   const timeDiff = task.deadline.getTime() - now.getTime();
  //   const oneHour = 60 * 60 * 1000;
  //   if (timeDiff > 0 && timeDiff <= oneHour) {
  //     setTimeout(() => {
  //       this.notificationClient.emit('notification.deadline', {
  //         userId: task.userId,
  //         taskId: taskId,
  //         title: task.title,
  //       });
  //     }, timeDiff);
  //   }
  // }
}
