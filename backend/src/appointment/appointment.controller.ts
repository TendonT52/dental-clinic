import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from 'src/auth/roles.decorator';
import { CreateAppointmentReq } from 'src/dto/createAppointment.dto';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Post()
  @Auth(Role.PATIENT)
  createAppointment(@Req() req, @Body() body: CreateAppointmentReq) {
    return this.appointmentService.createAppointment(req.user.userId, body);
  }

  @Post(':id/cancel')
  @Auth(Role.PATIENT, Role.DENTIST)
  cancelAppointment(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return this.appointmentService.cancelAppointment(req.user.userId, id);
  }

  @Post(':id/confirm')
  @Auth(Role.DENTIST)
  confirmAppointment(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return this.appointmentService.confirmAppointment(req.user.userId, id);
  }

  @Get()
  @Auth(Role.PATIENT, Role.DENTIST, Role.ADMIN)
  getAppointmentByDetails(
    @Req() req,
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('details') details: string,
  ) {
    return this.appointmentService.getAppointmentByDetails(
      req.user.userId,
      req.user.role,
      {
        skip,
        take,
        details,
      },
    );
  }

  @Get('patient')
  @Auth(Role.PATIENT)
  getAppointmentByPatientId(
    @Req() req,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return this.appointmentService.getAppointmentByPatientId(req.user.userId, {
      skip,
      take,
    });
  }

  @Get('dentist')
  @Auth(Role.DENTIST)
  getAppointments(
    @Req() req,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    console.log(req.user);
    return this.appointmentService.getAppointmentByDentistId(req.user.userId, {
      skip,
      take,
    });
  }
}
