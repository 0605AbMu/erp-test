import {
    Body,
    Controller,
    Post
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserService } from './users.service.js';

@Controller({
  path: 'users',
  version: '1'
})
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

//   @Post('login')
//   login(@Body() dto: LoginDto) {
//     return this.authService.login(dto);
//   }
}