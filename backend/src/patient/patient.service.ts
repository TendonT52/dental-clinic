import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { PrismaError } from 'prisma-error-enum';
import { AuthService } from 'src/auth/auth.service';
import { CreatePatientReq } from 'src/dto/createPatient.dto';
import { getPatientRes } from 'src/dto/getPatient.dto';
import { UpdatePatientReq } from 'src/dto/updatePatient.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async createPatient(req: CreatePatientReq) {
    const hash = await argon.hash(req.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          dateOfBirth: req.dateOfBirth,
          email: req.email,
          firstName: req.firstName,
          hash: hash,
          lastName: req.lastName,
          role: Role.PATIENT,
          telephone: req.telephone,
          Patient: {
            create: {},
          },
        },
      });

      return {
        token: await this.authService.getTokens(user.id, user.role),
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          telephone: user.telephone,
          dateOfBirth: user.dateOfBirth,
        },
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.UniqueConstraintViolation) {
          throw new ForbiddenException('email and telephone must be unique');
        }
      }
      throw error;
    }
  }

  async getPatient(id: number): Promise<getPatientRes> {
    try {
      const patient = await this.prismaService.user.findUnique({
        where: {
          id: id,
        },
        include: {
          Patient: true,
        },
      });

      return {
        id: patient.id,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
        email: patient.email,
        firstName: patient.firstName,
        lastName: patient.lastName,
        telephone: patient.telephone,
        dateOfBirth: patient.dateOfBirth,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new ForbiddenException('patient does not exist');
        }
      }
      throw error;
    }
  }

  async updatePatient(id: number, req: UpdatePatientReq) {
    try {
      await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          email: req.email,
          dateOfBirth: req.dateOfBirth,
          firstName: req.firstName,
          lastName: req.lastName,
          telephone: req.telephone,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.RecordDoesNotExist) {
          throw new ForbiddenException('patient does not exist');
        }
      }
      throw error;
    }
  }
}
