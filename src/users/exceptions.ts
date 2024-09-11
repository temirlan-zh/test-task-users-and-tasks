import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export class EmailExistsException extends ConflictException {
  constructor() {
    super('User with this email already exists');
  }
}

export class EmailRegexException extends BadRequestException {
  constructor() {
    super('Email regex check failed. Email must be a valid email address');
  }
}

export class PasswordRegexException extends BadRequestException {
  constructor() {
    super(
      'Password regex check failed. Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
    );
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User not found');
  }
}
