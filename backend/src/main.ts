import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
 const app = await NestFactory.create(AppModule);
 // Configuração do ValidationPipe (importante para o Swagger ler as validações)
 app.useGlobalPipes(new ValidationPipe());
 // Configuração do Swag

 const config = new DocumentBuilder()
 .setTitle('User CRUD API')
 .setDescription('Documentação da API de Usuários com NestJS e Prisma')
 .setVersion('1.0')
 .addTag('users')
 .build();
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api', app, document); // Rota onde o Swagger estará disponível
 await app.listen(3000);
 console.log(`Application is running on: http://localhost:3000/api`);
}
bootstrap();
