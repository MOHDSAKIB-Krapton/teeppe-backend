import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');  // Use '0.0.0.0' for wider accessibility
}

bootstrap();

async function bootstrapServer() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.setGlobalPrefix('api/v1');
  await app.init();
  return createServer(expressApp);
}

// Handler for Vercel
export async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer.emit('request', req, res);
}
