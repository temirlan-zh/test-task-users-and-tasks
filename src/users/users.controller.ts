import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  EmailExistsException,
  EmailRegexException,
  PasswordRegexException,
} from './exceptions';
import { ApiExceptions } from 'src/common/decorators/api-exceptions.decorator';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  @ApiExceptions(
    new EmailExistsException(),
    new PasswordRegexException(),
    new EmailRegexException(),
  )
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ type: [User] })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
