import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  //   @Prop({ required: true })
  //   id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
