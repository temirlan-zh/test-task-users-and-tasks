import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/common/enums/role.enum';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let mockUser: User;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockTasks: Task[];

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockTasksRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    mockUser = {
      id: 'user-1',
      email: 'user-1@example.com',
      password: 'hashed pass',
      role: Role.User,
    };
    mockTasks = [
      {
        id: 'task-1',
        user: mockUser,
        title: 'Task 1',
        description: 'Task 1 description',
      },
      {
        id: 'task-2',
        user: mockUser,
        title: 'Task 2',
        description: 'Task 2 description',
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should create and return a task', async () => {
      const user = mockUser;
      const createDto: CreateTaskDto = {
        userId: user.id,
        title: 'Some title',
        description: 'Some description',
      };
      const createdTask: Task = {
        ...createDto,
        id: 'some-id',
        user,
      };

      mockUsersService.findOne.mockResolvedValueOnce(user);
      mockTasksRepository.create.mockReturnValueOnce(createdTask);
      mockTasksRepository.save.mockResolvedValueOnce(createdTask);

      const result = await service.create(createDto);

      expect(result).toEqual(createdTask);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(user.id);
      expect(mockTasksRepository.create).toHaveBeenCalledWith({
        ...createDto,
        user,
      });
      expect(mockTasksRepository.save).toHaveBeenCalledWith(createdTask);
    });
  });
});
