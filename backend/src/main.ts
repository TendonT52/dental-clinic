import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap({ app }) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3000',
  });
}

NestFactory.create(AppModule).then(async (app) => {
  await bootstrap({ app });
  app.listen(8001);
});
