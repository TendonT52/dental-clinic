import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from 'src/auth/roles.decorator';
import { CreateSpecialistReq } from 'src/dto/createSpecialist.dto';
import { SpecialistService } from './specialist.service';

@Controller('specialists')
export class SpecialistController {
  constructor(private specialistService: SpecialistService) {}

  @Post()
  @Auth(Role.ADMIN)
  createSpecialist(@Body() body: CreateSpecialistReq) {
    return this.specialistService.createSpecialist(body.name);
  }

  @Get()
  getSpcialist() {
    return this.specialistService.getSpecialist();
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  deleteSpecialist(@Param('id', new ParseIntPipe()) id: number) {
    return this.specialistService.deleteSpecialist(id);
  }
}
