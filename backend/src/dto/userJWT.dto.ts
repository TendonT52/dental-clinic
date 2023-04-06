import { Role } from '@prisma/client';

export class UserJwt {
  userId: string;
  role: Role;
}
