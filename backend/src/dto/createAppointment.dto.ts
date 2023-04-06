import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentReq {
  @IsNumber()
  @IsNotEmpty()
  dentistId: number;

  @IsString()
  @IsNotEmpty()
  details: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  time: Date;
}

export class CreateAppointmentRes {
  id: number;
}
