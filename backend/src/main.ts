import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // === ADICIONE ESTA LINHA AQUI ===
  app.setGlobalPrefix('api'); 

  app.enableCors();
  // ===============================

  // Configuração do ValidationPipe
  app.useGlobalPipes(new ValidationPipe());

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Cine Ouro Pro API') 
    .setDescription('Documentação da API do Cinema com NestJS e Prisma')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Como agora o prefixo global é 'api', o Swagger pode ficar em 'api-docs' 
  // ou continuar em 'api' (o Nest entende a diferença)
  SwaggerModule.setup('api', app, document); 

  await app.listen(3000, '0.0.0.0');
  
  // O console.log agora reflete o prefixo
  console.log(`Application is running on: http://localhost:3000/api`);
}
bootstrap();