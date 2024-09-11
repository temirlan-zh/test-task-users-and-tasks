import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PAGE_LIMIT, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  EmailExistsException,
  EmailRegexException,
  PasswordRegexException,
  UserNotFoundException,
} from './exceptions';
import { ApiExceptions } from 'src/common/decorators/api-exceptions.decorator';
import { SortOrder } from 'src/common/enums/sort-order.enum';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { SortBy } from './enums/sort-by.enum';
import { Role } from 'src/common/enums/role.enum';

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
  @ApiQuery({ name: 'email', required: false, description: 'Filter by email' })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: Role,
    description: 'Filter by role',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: SortBy,
    description: `Sort by (default: ${SortBy.Email})`,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: SortOrder,
    description: `Sort order (default: ${SortOrder.ASC})`,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: `Items per page (default: ${PAGE_LIMIT})`,
  })
  @ApiPaginatedResponse(User)
  async findAll(
    @Query('email') email?: string,
    @Query('role') role?: Role,
    @Query('sortBy') sortBy: SortBy = SortBy.Email,
    @Query('order') order: SortOrder = SortOrder.ASC,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(PAGE_LIMIT), ParseIntPipe)
    limit?: number,
  ): Promise<PaginatedDto<User>> {
    return this.usersService.findAll(
      { email, role },
      { sortBy, order },
      { page, limit },
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  @ApiExceptions(new UserNotFoundException())
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findOne(id);
  }
}
