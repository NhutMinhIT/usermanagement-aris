import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    role: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    name: string; // Ensure this property is included
}

export const UserSchema = SchemaFactory.createForClass(User);