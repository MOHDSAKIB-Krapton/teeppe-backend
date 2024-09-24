import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with default settings
  app.enableCors({
    origin: ['http://localhost:3000', 'https://your-frontend-domain.com'], // List of allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed HTTP methods
    credentials: true, // Enable credentials if needed (e.g., cookies, authorization headers)
  });

  // Set global API prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
