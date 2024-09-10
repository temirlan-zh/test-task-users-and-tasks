import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Role } from 'src/common/enums/role.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '87a52c86-fa88-4e7d-9615-10e6a6af1026' })
  id: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: Role.User })
  @ApiProperty({ example: Role.User })
  role: Role;
}
