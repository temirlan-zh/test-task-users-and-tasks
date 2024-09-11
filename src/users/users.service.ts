import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { EmailExistsException } from './exceptions';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { SortBy } from './enums/sort-by.enum';
import { SortOrder } from 'src/common/enums/sort-order.enum';
import { Role } from 'src/common/enums/role.enum';

export const PAGE_LIMIT = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = createUserDto;

    // Check if user with this email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new EmailExistsException();
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      ...rest,
    });

    return this.usersRepository.save(user);
  }

  async findAll(
    filter: { email?: string; role?: Role },
    sort: { sortBy?: SortBy; order?: SortOrder },
    paging: { page?: number; limit?: number },
  ): Promise<PaginatedDto<User>> {
    const { email, role } = filter;
    const { sortBy = SortBy.Email, order = SortOrder.ASC } = sort;
    const { page = 1, limit = PAGE_LIMIT } = paging;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (email) {
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    queryBuilder.orderBy(`user.${sortBy}`, order);
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [results, total] = await queryBuilder.getManyAndCount();

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      results,
    };
  }
}
