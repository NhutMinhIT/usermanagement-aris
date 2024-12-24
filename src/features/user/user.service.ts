import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

interface PaginatedResponse {
    data: User[];
    total: number;
    page: number;
    limit: number;
}

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findAll(limit: number, page: number, search: string): Promise<PaginatedResponse> {
        const query = search ? {
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const [users, total] = await Promise.all([
            this.userModel.find(query)
                .limit(limit)
                .skip(limit * (page - 1))
                .lean()
                .exec(),
            this.userModel.countDocuments(query)
        ]);

        return {
            data: users,
            total,
            page,
            limit
        };
    }

    private async checkExisting(username: string, email: string) {
        const existingUser = await this.userModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                throw new ConflictException('Username already exists');
            }
            if (existingUser.email === email) {
                throw new ConflictException('Email already exists');
            }
        }
    }
    async create(createUserDto: CreateUserDto): Promise<User> {
        await this.checkExisting(createUserDto.username, createUserDto.email);

        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }
}