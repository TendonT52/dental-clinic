import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from 'src/auth/roles.decorator';
import { CreatePatientReq } from 'src/dto/createPatient.dto';
import { UpdatePatientReq } from 'src/dto/updatePatient.dto';
import { PatientService } from './patient.service';

@Controller('patients')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Post()
  createPatient(@Body() req: CreatePatientReq) {
    return this.patientService.createPatient(req);
  }

  @Get(':id')
  @Auth(Role.PATIENT, Role.ADMIN)
  getPatient(@Param('id', new ParseIntPipe()) id: number, @Req() req) {
    if (req.user.role === Role.PATIENT && req.user.userId !== id) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    return this.patientService.getPatient(req.user.userId);
  }

  @Put(':id')
  @Auth(Role.PATIENT, Role.ADMIN)
  putPatient(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req,
    @Body() body: UpdatePatientReq,
  ) {
    if (req.user.role === Role.PATIENT && req.user.userId !== id) {
      throw new UnauthorizedException(
        'You are not authorized to edit this resource',
      );
    }
    return this.patientService.updatePatient(id, body);
  }
}
