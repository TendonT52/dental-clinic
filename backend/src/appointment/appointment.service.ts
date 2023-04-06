import { ForbiddenException, Injectable } from '@nestjs/common';
import { Appointment, Prisma, Role, Status } from '@prisma/client';
import { PrismaError } from 'prisma-error-enum';
import {
  CreateAppointmentReq,
  CreateAppointmentRes,
} from 'src/dto/createAppointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentService {
  constructor(private prismaService: PrismaService) {}

  async createAppointment(
    patientId: number,
    req: CreateAppointmentReq,
  ): Promise<CreateAppointmentRes> {
    try {
      const appointment = await this.prismaService.appointment.create({
        data: {
          time: req.time,
          details: req.details,
          status: Status.PENDING,
          dentist: {
            connect: {
              userId: req.dentistId,
            },
          },
          patient: {
            connect: {
              userId: patientId,
            },
          },
        },
      });
      return {
        id: appointment.id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.UniqueConstraintViolation) {
          throw new ForbiddenException('appointment must be unique');
        }
      }
    }
  }

  async cancelAppointment(userId: number, appointmentId: number) {
    try {
      const appointment = await this.prismaService.appointment.findUnique({
        where: {
          id: appointmentId,
        },
      });

      if (
        appointment.patientId !== userId &&
        appointment.dentistId !== userId
      ) {
        throw new ForbiddenException(
          'You are not authorized to cancel this appointment',
        );
      }

      if (appointment.status === Status.CANCELED) {
        throw new ForbiddenException('appointment already canceled');
      }

      if (appointment.status === Status.COMPLETED) {
        throw new ForbiddenException('appointment already completed');
      }

      await this.prismaService.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status: Status.CANCELED,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new ForbiddenException('appointment not found');
        }
      }
    }
  }

  async confirmAppointment(userId: number, appointmentId: number) {
    try {
      const appointment = await this.prismaService.appointment.findUnique({
        where: {
          id: appointmentId,
        },
      });

      if (appointment.dentistId !== userId) {
        throw new ForbiddenException(
          'You are not authorized to confirm this appointment',
        );
      }

      if (appointment.status === Status.CANCELED) {
        throw new ForbiddenException('appointment already canceled');
      }

      if (appointment.status === Status.COMPLETED) {
        throw new ForbiddenException('appointment already completed');
      }

      if (appointment.status === Status.CONFIRMED) {
        throw new ForbiddenException('appointment already confirmed');
      }

      await this.prismaService.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status: Status.CONFIRMED,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new ForbiddenException('appointment not found');
        }
      }
    }
  }

  async getAppointmentByPatientId(
    patientId: number,
    query: {
      skip: number;
      take: number;
    },
  ) {
    try {
      const appointments = await this.prismaService.appointment.findMany({
        skip: query.skip,
        take: query.take,
        where: {
          patientId: patientId,
        },
      });
      return appointments;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new ForbiddenException('appointment not found');
        }
      }
    }
  }

  async getAppointmentByDentistId(
    dentistId: number,
    query: {
      skip: number;
      take: number;
    },
  ) {
    try {
      const appointments = await this.prismaService.appointment.findMany({
        skip: query.skip,
        take: query.take,
        where: {
          dentistId: dentistId,
        },
      });
      return appointments;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new ForbiddenException('appointment not found');
        }
      }
    }
  }

  async getAppointmentByDetails(
    userId: number,
    role: Role,
    query: {
      skip: number;
      take: number;
      details: string;
    },
  ) {
    console.log({
      userId,
      role,
      query,
    });
    try {
      let appointment: Appointment[];
      if (role === Role.PATIENT) {
        appointment = await this.prismaService.appointment.findMany({
          skip: query.skip,
          take: query.take,
          where: {
            patientId: userId,
            details: {
              search: query.details,
            },
          },
          include: {
            dentist: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    Dentist: {
                      select: {
                        SpecialistOfDentist: {
                          select: {
                            specialist: {
                              select: {
                                name: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }
      if (role === Role.DENTIST) {
        appointment = await this.prismaService.appointment.findMany({
          skip: query.skip,
          take: query.take,
          where: {
            dentistId: userId,
            details: {
              search: query.details,
            },
          },
        });
      }
      if (role === Role.ADMIN) {
        appointment = await this.prismaService.appointment.findMany({
          skip: query.skip,
          take: query.take,
          where: {
            details: {
              search: query.details,
            },
          },
        });
      }
      return appointment;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new ForbiddenException('appointment not found');
        }
      }
    }
  }
}
