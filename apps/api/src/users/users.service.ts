import { Injectable } from '@nestjs/common';
import { User } from '@repo/database';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | undefined> {
    return (
      (await this.prisma.user.findUnique({
        where: {
          email,
        },
      })) ?? undefined
    );
  }
}
