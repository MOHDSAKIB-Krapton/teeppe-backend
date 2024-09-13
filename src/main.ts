import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

let cachedServer: any;

// Function to bootstrap the app locally (for development)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
