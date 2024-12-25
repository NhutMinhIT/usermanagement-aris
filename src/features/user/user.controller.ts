import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { PaginatedResponse, UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserResponse } from 'src/interfaces/remove-user.interface';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'user')
    async findAll(
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1,
        @Query('search') search: string = ''
    ): Promise<PaginatedResponse> {
        return this.userService.findAll(limit, page, search);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'user')
    async findOne(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async remove(
        @Param('id') id: string,
        @Request() req: any
    ): Promise<DeleteUserResponse> {
        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;

        try {
            await this.userService.removeById(id, currentUserId, currentUserRole);
            return {
                success: true,
                message: `User with ID ${id} successfully deleted`,
                statusCode: 200,
            };
        } catch (error) {
            throw error;
        }
    }
}