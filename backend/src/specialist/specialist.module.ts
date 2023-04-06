import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SpecialistController } from './specialist.controller';
import { SpecialistService } from './specialist.service';

@Module({
  imports: [PrismaModule],
  controllers: [SpecialistController],
  providers: [SpecialistService],
})
export class SpecialistModule {}
