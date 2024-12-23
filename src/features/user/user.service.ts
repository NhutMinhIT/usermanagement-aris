import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    private users: User[] = [];

    findAll(): User[] {
        return this.users;
    }
}