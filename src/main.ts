import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function bootstrap() {

  const app = process.env.DEV_ENV ? await NestFactory.create(AppModule) :
    await NestFactory.create(AppModule, {});

  const config = new DocumentBuilder()
    .setTitle('SB Rest Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(process.env.SERVER_PORT || 3000);
}
bootstrap();
