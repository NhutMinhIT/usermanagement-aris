import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UploadUserDto extends PartialType(CreateUserDto) { }