import { PartialType } from '@nestjs/swagger';
import { User } from '../models/user.model';

export class UserDto extends PartialType(User) {}
