import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  // Check email with regex
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Email regex check failed. Email must be a valid email address',
  })
  email: string;

  @IsString()
  @MinLength(8)
  // Check password with regex
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password regex check failed. Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
  })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
