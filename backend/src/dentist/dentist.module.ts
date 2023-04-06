import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DentistController } from './dentist.controller';
import { DentistService } from './dentist.service';

@Module({
  imports: [AuthModule],
  providers: [DentistService],
  controllers: [DentistController],
})
export class DentistModule {}
