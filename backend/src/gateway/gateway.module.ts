import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MyGateWay } from './gateway';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_ACCESS'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXP_ACCESS'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthGuard, MyGateWay],
})
export class GatewayModule {}
