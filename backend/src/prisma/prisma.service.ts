import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      log: ['query'],
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async cleanDb() {
    const tablenames = await this.$queryRaw<
      Array<{ TABLE_NAME: string }>
    >`SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = 'dental'`;

    const tables = tablenames
      .map((obj) => obj.TABLE_NAME)
      .filter((name) => name !== '_prisma_migrations');

    await this.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0`);
    tables.forEach(async (table) => {
      await this.$executeRawUnsafe(`TRUNCATE table ${table}`);
    });
    await this.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1`);
  }
}
