import { Injectable } from '@nestjs/common';
import { User } from '@repo/database';
import { PrismaService } from 'src/prisma/prisma.service';

// Define a safe user type without password
export type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<SafeUser | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user ?? undefined;
  }

  async findAll(): Promise<SafeUser[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Method for authentication that includes password (used internally)
  async findOneWithPassword(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user ?? undefined;
  }
}
