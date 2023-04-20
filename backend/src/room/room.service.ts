import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}

  async createRoom(userId: number) {
    const room = await this.prismaService.room.findUnique({
      where: {
        patientId: userId,
      },
    });
    if (room) {
      throw new ForbiddenException('You have created a room already');
    }
    try {
      const room = await this.prismaService.room.create({
        data: {
          patient: {
            connect: {
              userId: userId,
            },
          },
        },
      });
      return {
        id: room.id,
      };
    } catch (error) {
      return error;
    }
  }

  async getRooms() {
    try {
      const rooms = await this.prismaService.room.findMany();
      return rooms;
    } catch (error) {
      return error;
    }
  }

  async getRoomByPatientId(userId: number) {
    try {
      const room = await this.prismaService.room.findUnique({
        where: {
          patientId: userId,
        },
      });
      return room;
    } catch (error) {
      return error;
    }
  }
}
