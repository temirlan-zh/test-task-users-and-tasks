import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { userId } = createTaskDto;

    const user = await this.usersService.findOne(userId);

    const task = this.tasksRepository.create({
      ...createTaskDto,
      user,
    });

    return this.tasksRepository.save(task);
  }

  findAll() {
    throw new NotImplementedException();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: string, updateTaskDto: UpdateTaskDto) {
    throw new NotImplementedException();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove(id: string) {
    throw new NotImplementedException();
  }
}
