import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { EmailRegexException, PasswordRegexException } from '../exceptions';

export class CreateUserDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsString()
  // Check email with regex
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: new EmailRegexException().message,
  })
  email: string;

  @ApiProperty({
    description:
      'Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
    minLength: 8,
    example: '123456Aa',
  })
  @IsString()
  // Check password with regex
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: new PasswordRegexException().message,
  })
  password: string;

  @ApiProperty({
    required: false,
    enum: Role,
    default: Role.User,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
