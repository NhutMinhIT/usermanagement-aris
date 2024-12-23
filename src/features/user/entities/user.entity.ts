import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class User extends Document {
    @Prop() id: string;
    @Prop() username: string;
    @Prop() name: string;
    @Prop() email: string;
    @Prop() role: string;
}