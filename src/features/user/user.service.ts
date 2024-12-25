import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

export interface PaginatedResponse {
    data: User[];
    total: number;
    page: number;
    limit: number;
}

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findAll(limit: number = 10, page: number = 1, search: string = ''): Promise<PaginatedResponse> {
        // Validate input parameters
        const validLimit = Math.max(1, Math.abs(Number(limit)));
        const validPage = Math.max(1, Math.abs(Number(page)));

        // Build search query
        const query = search ? {
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        } : {};

        // Execute search and pagination in parallel
        const [users, total] = await Promise.all([
            this.userModel.find(query)

                .limit(validLimit)
                .skip(validLimit * (validPage - 1))
                .lean()
                .exec(),
            this.userModel.countDocuments(query)
        ]);

        // Return paginated response
        return {
            data: users,
            total,
            page: validPage,
            limit: validLimit
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

    async removeById(id: string, currentUserId: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid user ID');
        }

        if (id === currentUserId) {
            throw new BadRequestException('Cannot delete yourself');
        }

        const result = await this.userModel.deleteOne({ _id: new Types.ObjectId(id) });
        if (result.deletedCount === 0) {
            throw new NotFoundException('User not found');
        }
        return true;
    }

}