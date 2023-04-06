import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreatePatientReq {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  telephone: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  password: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;
}

export class CreatePatientRes {
  accessToken: string;
  user: {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    telephone: string;
    dateOfBirth: Date;
  };
}
