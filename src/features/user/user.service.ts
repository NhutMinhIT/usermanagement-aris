import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findAll(limit: number, page: number, search: string): Promise<User[]> {
        const query = search ? { $or: [{ username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
        const users = await this.userModel.find(query)
            .limit(limit)
            .skip(limit * (page - 1))
            .lean() // Convert Mongoose documents to plain JavaScript objects
            .exec();
        return users;
    }
}