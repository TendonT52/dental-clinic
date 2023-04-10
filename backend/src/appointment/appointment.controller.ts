import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from 'src/auth/roles.decorator';
import { CreateAppointmentReq } from 'src/dto/createAppointment.dto';
import { UpdateAppointmentReq } from 'src/dto/updateAppointment.dto';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Post()
  @Auth(Role.PATIENT)
  createAppointment(@Req() req, @Body() body: CreateAppointmentReq) {
    return this.appointmentService.createAppointment(req.user.userId, body);
  }

  @Patch(':id/cancel')
  @Auth(Role.PATIENT, Role.DENTIST)
  cancelAppointment(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return this.appointmentService.cancelAppointment(req.user.userId, id);
  }

  @Patch(':id/confirm')
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

  @Patch(':id')
  @Auth(Role.PATIENT, Role.DENTIST, Role.ADMIN)
  updateAppointmentByDetails(
    @Param('id', new ParseIntPipe()) id,
    @Req() req,
    @Body() body: UpdateAppointmentReq,
  ) {
    return this.appointmentService.updateAppointmentByDetails(
      id,
      body,
      req.user.userId,
      req.user.role,
    );
  }

  @Delete(':id')
  @Auth(Role.PATIENT, Role.DENTIST, Role.ADMIN)
  deleteAppointmentByDetails(@Param('id', new ParseIntPipe()) id, @Req() req) {
    return this.appointmentService.deleteAppointment(
      id,
      req.user.userId,
      req.user.role,
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
