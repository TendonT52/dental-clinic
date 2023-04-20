import { Controller, Get, Post, Req } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from 'src/auth/roles.decorator';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}
  @Post()
  @Auth(Role.PATIENT)
  createRoom(@Req() req) {
    return this.roomService.createRoom(req.user.userId);
  }

  @Get()
  @Auth(Role.ADMIN)
  getRooms() {
    return this.roomService.getRooms();
  }

  @Get('patient')
  @Auth(Role.PATIENT)
  getRoomByPatientId(@Req() req) {
    return this.roomService.getRoomByPatientId(req.user.userId);
  }
}
