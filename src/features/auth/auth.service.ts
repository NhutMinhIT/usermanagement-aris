import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.userModel.findOne({ username: loginDto.username }).exec();

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username: user.username, sub: user._id, role: user.role };
        return {
            user,
            access_token: this.jwtService.sign(payload),
            message: 'User logged in successfully',
        };
    }

    async register(registerDto: RegisterDto) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

            const checkExistUser = await this.userModel.findOne({ username: registerDto.username }).exec();
            if (checkExistUser) {
                throw new UnauthorizedException('Username already exists');
            }
            const createdUser = new this.userModel({
                ...registerDto,
                password: hashedPassword,
            });

            const user = await createdUser.save();

            return {
                user,
                message: 'User registered successfully',
            };
        } catch (error) {
            console.error('Error during registration:', error);
            throw new InternalServerErrorException('Registration failed');
        }
    }


}