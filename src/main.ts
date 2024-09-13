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

  app.enableCors({
    origin: '*', // Adjust this to your frontend domain for production
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}

// Function to bootstrap the server in a serverless environment (for Vercel)
async function bootstrapServer() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: '*', // Adjust this to your frontend domain for production
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });
  await app.init();
  return createServer(expressApp);
}

// This is the Vercel handler function
export async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer.emit('request', req, res);
}

// Run bootstrap locally (only for local development)
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}
