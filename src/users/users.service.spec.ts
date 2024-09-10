import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn((data) => ({ role: Role.User, ...data, id: 'some-id' })),
    save: jest.fn((entity) => Promise.resolve(entity)),
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
    it('should return all users', async () => {
      const users: User[] = [
        {
          id: 'some-id',
          email: 'test@example.com',
          password: 'some-pass',
          role: Role.User,
        },
      ];

      mockUsersRepository.find.mockResolvedValueOnce(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockUsersRepository.find).toHaveBeenCalledWith();
    });
  });
});
