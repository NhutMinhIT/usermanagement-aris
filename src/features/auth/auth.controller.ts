import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) { }

    // Implement login and register routes here
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.AuthService.login(loginDto);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.AuthService.register(registerDto);
    }
}
