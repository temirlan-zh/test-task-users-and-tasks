import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { mockUsers } from './mocks';
import { SortBy } from './enums/sort-by.enum';
import { SortOrder } from 'src/common/enums/sort-order.enum';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { filter, sortBy } from 'lodash';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([mockUsers, mockUsers.length]),
  };

  const mockUsersRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    findOneBy: jest.fn().mockResolvedValue(null),
    create: jest.fn((data) => ({ role: Role.User, ...data, id: 'some-id' })),
    save: jest.fn((entity) => Promise.resolve(entity)),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create user with default role', async () => {
      const data: CreateUserDto = {
        email: 'test@example.com',
        password: '123456Aa',
      };

      const result = await service.create(data);

      expect(result).toMatchObject({
        email: data.email,
        id: expect.any(String),
        role: Role.User,
      });
      expect(mockUsersRepository.save).toHaveBeenCalledWith({
        email: data.email,
        id: expect.any(String),
        password: expect.any(String),
        role: Role.User,
      });
    });

    it('should create user with specified role', async () => {
      const data: CreateUserDto = {
        email: 'test@example.com',
        password: '123456Aa',
        role: Role.Admin,
      };

      const result = await service.create(data);

      expect(result.role).toBe(Role.Admin);
      expect(mockUsersRepository.save).toHaveBeenCalledWith({
        email: data.email,
        id: expect.any(String),
        password: expect.any(String),
        role: Role.Admin,
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of users with pagination, filtering, and sorting', async () => {
      const role = Role.Admin;
      const sort = SortBy.Email;
      const page = 1;
      const limit = 1;
      const users = sortBy(filter(mockUsers, { role }), sort);
      const total = users.length;

      mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([users, total]);

      const result = await service.findAll(
        { role },
        { sortBy: sort, order: SortOrder.ASC },
        { page, limit },
      );

      expect(result).toEqual<PaginatedDto<User>>({
        results: users,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
      expect(mockUsersRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find user by id', async () => {
      const user = mockUsers[0];

      mockUsersRepository.findOneBy.mockResolvedValueOnce(user);

      const result = await service.findOne(user.id);

      expect(result).toEqual(user);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        id: user.id,
      });
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const user = mockUsers[0];
      const update: UpdateUserDto = {
        email: 'new-email@example.com',
        password: 'new-pass',
        role: Role.User,
      };
      const updatedUser: User = { ...user, ...update, password: 'hashed-pass' };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);
      mockUsersRepository.save.mockResolvedValueOnce(updatedUser);

      const result = await service.update(user.id, update);

      expect(result).toEqual(updatedUser);
      expect(mockUsersRepository.save).toHaveBeenCalledWith({
        ...user,
        ...update,
        password: expect.any(String),
      });
    });
  });

  describe('delete', () => {
    it('should delete user by id', async () => {
      const id = 'some-id';

      await service.remove(id);

      expect(mockUsersRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
