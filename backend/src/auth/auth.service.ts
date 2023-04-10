import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as argon from 'argon2';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async login(req: User) {
    const token = await this.getTokens(req.id, req.role);
    return {
      token: token,
      user: {
        id: req.id,
        email: req.email,
        role: req.role,
        firstName: req.firstName,
        lastName: req.lastName,
        telephone: req.telephone,
        dateOfBirth: req.dateOfBirth,
      },
    };
  }

  async logout(userId: number) {
    await this.userService.updateRefreshToken(userId, null);
  }

  async validate(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const isPWMatch = await argon.verify(user.hash, password);
    if (!isPWMatch) {
      return null;
    }
    return user;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
  }

  async getTokens(userId: number, role: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          role: role,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_ACCESS'),
          expiresIn: this.configService.get<string>('JWT_EXP_ACCESS'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          role: role,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
          expiresIn: this.configService.get<string>('JWT_EXP_REFRESH'),
        },
      ),
    ]);
    await this.updateRefreshToken(userId, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.role);
    return {
      token: tokens,
    };
  }
}
