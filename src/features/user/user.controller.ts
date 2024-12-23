import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    findAll() {
        return this.userService.findAll();
    }
}