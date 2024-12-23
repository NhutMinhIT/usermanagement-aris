import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findAll(
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1,
        @Query('search') search: string = ''
    ) {
        return this.userService.findAll(limit, page, search);
    }
}