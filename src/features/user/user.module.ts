import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from "../auth/entities/user.entity";
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy'; // Import JwtStrategy

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        AuthModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '3h' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService, JwtStrategy] // Add JwtStrategy to providers
})
export class UserModule { }