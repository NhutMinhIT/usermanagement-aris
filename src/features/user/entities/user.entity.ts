import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop() id: string;
    @Prop() username: string;
    @Prop() name: string;
    @Prop() email: string;
    @Prop() role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);