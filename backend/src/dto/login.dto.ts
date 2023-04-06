import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginReq {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginRes {
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
