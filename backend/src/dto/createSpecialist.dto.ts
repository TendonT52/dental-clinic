import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecialistReq {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateSpecialistRes {
  id: number;
}
