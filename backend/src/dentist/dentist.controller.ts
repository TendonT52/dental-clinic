import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from 'src/auth/roles.decorator';
import { CreateDentistReq } from 'src/dto/createDentist.dto';
import { UpdateDentistReq } from 'src/dto/updateDentist.dto';
import { DentistService } from './dentist.service';

@Controller('dentists')
export class DentistController {
  constructor(private dentistService: DentistService) {}

  @Post()
  createDentist(@Body() req: CreateDentistReq) {
    return this.dentistService.createDentist(req);
  }

  @Get()
  @Auth(Role.PATIENT, Role.DENTIST, Role.ADMIN)
  getAllDentist() {
    return this.dentistService.listDentist();
  }

  @Get(':id')
  @Auth(Role.PATIENT, Role.DENTIST, Role.ADMIN)
  getDentist(@Param('id', new ParseIntPipe()) id, @Req() req) {
    return this.dentistService.getDentist(req.user.userId);
  }

  @Put()
  @Auth(Role.DENTIST)
  putDentist(@Req() req, @Body() body: UpdateDentistReq) {
    return this.dentistService.updateDentist(req.user.userId, body);
  }
}
