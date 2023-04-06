import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaError } from 'prisma-error-enum';
import { CreateSpecialistRes } from 'src/dto/createSpecialist.dto';
import { GetAllSpecialistRes } from 'src/dto/getSpecialist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SpecialistService {
  constructor(private prismaService: PrismaService) {}

  async createSpecialist(name: string): Promise<CreateSpecialistRes> {
    try {
      const specialist = await this.prismaService.specialist.create({
        data: {
          name: name,
        },
      });
      return {
        id: specialist.id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.UniqueConstraintViolation) {
          throw new ForbiddenException('specialist must be unique');
        }
      }
    }
  }

  async getSpecialist(): Promise<GetAllSpecialistRes> {
    try {
      const specialists = await this.prismaService.specialist.findMany();

      return {
        specialists: specialists.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        }),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new ForbiddenException('specialist not found');
        }
      }
    }
  }

  async deleteSpecialist(id: number) {
    try {
      await this.prismaService.specialist.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new ForbiddenException(`specialist id ${id} not found`);
        }
      }
    }
  }
}
