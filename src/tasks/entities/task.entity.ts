import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ManyToOne(() => User)
  @Exclude()
  user: User;

  @Column()
  @ApiProperty()
  title: string;

  @Column({ nullable: true })
  @ApiPropertyOptional()
  description?: string;
}
