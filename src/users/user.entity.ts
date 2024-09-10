import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '87a52c86-fa88-4e7d-9615-10e6a6af1026' })
  id: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @Column({ default: Role.User })
  @ApiProperty({ example: Role.User })
  role: Role;
}

@Entity('users')
export class UserEntity extends User {
  @Column()
  password: string;
}
