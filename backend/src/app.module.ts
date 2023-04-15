import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { DentistModule } from './dentist/dentist.module';
import { GatewayModule } from './gateway/gateway.module';
import { PatientController } from './patient/patient.controller';
import { PatientModule } from './patient/patient.module';
import { PatientService } from './patient/patient.service';
import { PrismaModule } from './prisma/prisma.module';
import { SpecialistController } from './specialist/specialist.controller';
import { SpecialistModule } from './specialist/specialist.module';
import { SpecialistService } from './specialist/specialist.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PatientModule,
    UserModule,
    DentistModule,
    AppointmentModule,
    SpecialistModule,
    AppointmentModule,
    GatewayModule,
  ],
  controllers: [AppController, PatientController, SpecialistController],
  providers: [AppService, PatientService, SpecialistService],
})
export class AppModule {}
