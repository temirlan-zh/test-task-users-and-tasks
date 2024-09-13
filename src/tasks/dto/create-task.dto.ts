import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

const TITLE_MIN_LENGTH = 1;

export class CreateTaskDto implements Partial<Task> {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ minLength: TITLE_MIN_LENGTH })
  @IsString()
  @MinLength(TITLE_MIN_LENGTH)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
