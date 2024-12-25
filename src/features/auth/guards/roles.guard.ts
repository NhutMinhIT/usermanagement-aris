import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new ForbiddenException('No token provided');
        }

        const user = this.jwtService.verify(token);

        // For delete operations, require admin role
        if (request.method === 'DELETE') {
            if (user.role !== 'admin') {
                throw new ForbiddenException('Only admins can delete users');
            }
        }

        // If no specific roles are required, allow access
        if (!requiredRoles) {
            return true;
        }

        // Check if user has required roles
        return requiredRoles.includes(user.role);
    }
}