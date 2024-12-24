import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PaginatedResponse, UserService } from './user.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findAll(
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1,
        @Query('search') search: string = ''
    ): Promise<PaginatedResponse> {
        return this.userService.findAll(limit, page, search);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

}