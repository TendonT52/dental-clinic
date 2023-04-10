import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentReq {
  @IsOptional()
  @IsNumber()
  dentistId: number;

  @IsOptional()
  @IsString()
  details: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  time: Date;
}
