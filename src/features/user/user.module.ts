import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { UserSchema } from "../auth/entities/user.entity";
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        AuthModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Replace with your secret key
            signOptions: { expiresIn: '3h' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule { }