import { Role } from 'src/common/enums/role.enum';
import { User } from './user.entity';

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin-1@example.com',
    password: 'some-pass',
    role: Role.Admin,
  },
  {
    id: 'admin-2',
    email: 'admin-2@example.com',
    password: 'some-pass',
    role: Role.Admin,
  },
  {
    id: 'user-1',
    email: 'user-1@example.com',
    password: 'some-pass',
    role: Role.User,
  },
  {
    id: 'user-2',
    email: 'user-2@example.com',
    password: 'some-pass',
    role: Role.User,
  },
];
