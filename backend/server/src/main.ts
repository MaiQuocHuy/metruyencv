import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';
import { DatabaseExceptionsFilter } from '@common/filters/db.exception';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from './configs/swagger.config';
// import { ValidationError } from 'sequelize';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // {
    //   logger: false,
    // },
  );
  const configService = app.get(ConfigService);

  // Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // transform: true, // Enable transformation to apply DTO class types
      disableErrorMessages:
        process.env.NODE_ENV == 'development' ? true : false,
      // exceptionFactory: (validationErrors: ValidationError[] = []) => {
      //   return new BadRequestException(validationErrors);
      // },
    }),
  );
  app.useGlobalFilters(new DatabaseExceptionsFilter());
  app.use(helmet());
  app.enableCors();

  // Swagger
  const config = SwaggerConfig.configDocumentBuilder;
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    'api',
    app,
    documentFactory,
    SwaggerConfig.SwaggerCustomOptions,
  );

  const port = configService.get('PORT') ?? 3000;
  await app.listen(port);

  if (configService.get('NODE_ENV') === 'development') {
    console.log(`📖 Swagger UI is available at: http://localhost:${port}/api`);
  }
}
bootstrap();
