import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaError } from 'prisma-error-enum';
import { AuthService } from 'src/auth/auth.service';
import { CreateDentistReq } from 'src/dto/createDentist.dto';
import { GetDentistRes } from 'src/dto/getDentist.dto';
import { UpdateDentistReq } from 'src/dto/updateDentist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DentistService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async createDentist(req: CreateDentistReq) {
    try {
      const hash = await argon.hash(req.password);
      const user = await this.prismaService.user.create({
        data: {
          dateOfBirth: req.dateOfBirth,
          email: req.email,
          firstName: req.firstName,
          hash: hash,
          lastName: req.lastName,
          role: Role.DENTIST,
          telephone: req.telephone,
          Dentist: {
            create: {
              SpecialistOfDentist: {
                create: req.specialist.map((item) => {
                  return {
                    specialistId: item.id,
                    yearOfExperience: item.yearOfExperience,
                  };
                }),
              },
            },
          },
        },
      });

      return {
        token: await this.authService.getTokens(user.id, user.role),
        id: user.id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.UniqueConstraintViolation) {
          throw new ForbiddenException('email and telephone must be unique');
        }
      }
      throw error;
    }
  }

  async getDentist(id: number): Promise<GetDentistRes> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: id,
        },
        include: {
          Dentist: {
            include: {
              SpecialistOfDentist: {
                include: {
                  specialist: true,
                },
              },
            },
          },
        },
      });

      return {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        telephone: user.telephone,
        dateOfBirth: user.dateOfBirth,
        specialist: user.Dentist.SpecialistOfDentist.map((item) => {
          return {
            id: item.specialist.id,
            name: item.specialist.name,
            yearOfExperience: item.yearOfExperience,
          };
        }),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new ForbiddenException('dentist does not exist');
        }
      }
      throw error;
    }
  }

  async updateDentist(id: number, req: UpdateDentistReq) {
    try {
      await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          dateOfBirth: req.dateOfBirth,
          email: req.email,
          firstName: req.firstName,
          lastName: req.lastName,
          telephone: req.telephone,
          Dentist: {
            update: {
              SpecialistOfDentist: {
                deleteMany: {
                  dentistId: id,
                },
                createMany: {
                  data: req.specialist.map((item) => {
                    return {
                      specialistId: item.id,
                      yearOfExperience: item.yearOfExperience,
                    };
                  }),
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new ForbiddenException('dentist does not exist');
        }
      }
      throw error;
    }
  }

  async listDentist() {
    const dentists = await this.prismaService.user.findMany({
      where: {
        role: Role.DENTIST,
      },
      include: {
        Dentist: {
          include: {
            SpecialistOfDentist: {
              include: {
                specialist: true,
              },
            },
          },
        },
      },
    });
    return dentists.map((item) => {
      return {
        id: item.id,
        dateOfBirth: item.dateOfBirth,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        telephone: item.telephone,
        specialist: item.Dentist.SpecialistOfDentist.map((item) => {
          return {
            name: item.specialist.name,
            yearOfExperience: item.yearOfExperience,
          };
        }),
        totalExperience: item.Dentist.SpecialistOfDentist.reduce(
          (acc, cur) => acc + cur.yearOfExperience,
          0,
        ),
      };
    });
  }
}
