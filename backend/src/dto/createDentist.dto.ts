import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { SpaciallistOfDentist } from './spaciallist.dto';

export class CreateDentistReq {
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

  @IsNotEmpty()
  @IsArray()
  specialist: SpaciallistOfDentist[];
}

export class CreateDentistRes {
  accessToken: string;
  id: number;
}
