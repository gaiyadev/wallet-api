import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  app.use(helmet());
  app.enableCors({
    origin: '*',
  });

  const version = 'v1';
  app.setGlobalPrefix(`api/${version}`);

  process.on('uncaughtException', (err) => {
    logger.error(err);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    logger.error(err);
  });

  const PORT = parseInt(process.env.PORT) || 5000;
  await app.listen(PORT, () => {
    logger.log(
      `${process.env.APP_NAME} API listening on port ${PORT} in ${process.env.NODE_ENV} mode`,
    );
  });
}
bootstrap();
