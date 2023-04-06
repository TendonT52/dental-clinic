import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { LoginRes } from 'src/dto/login.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(req: User): Promise<LoginRes> {
    const token = await this.generateAccessToken(req.id, req.role);
    return {
      accessToken: token,
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

  async generateAccessToken(userId: number, role: string) {
    const payload = { sub: userId, role: role };
    const token = await this.jwtService.signAsync(payload);
    return token;
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
}
