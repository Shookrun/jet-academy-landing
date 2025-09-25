// main.ts
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Express body parser istifadə edəcəyik
  });

  // Body parser limitləri - 50MB
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(express.raw({ limit: '50mb', type: 'application/octet-stream' }));

  // CORS config
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://jetschool.az',
        'https://www.jetschool.az',
        'https://new.jetacademy.az',
        'https://www.new.jetacademy.az',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3032',
        'http://localhost:3030',
        'http://localhost:3031',
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Production-da true
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400,
  });

  // Static files middleware
  app.use((req, res, next) => {
    if (req.path.includes('/uploads-acad/') || req.path.endsWith('.webp')) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    next();
  });

  app.setGlobalPrefix('api');

  // Swagger config...
  const config = new DocumentBuilder()
    .setTitle('JET School API')
    .setDescription('API endpoints documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    jsonDocumentUrl: 'docs/swagger/json',
  });

  app.use(
    '/reference',
    apiReference({
      theme: 'deepSpace',
      spec: {
        url: 'api/docs/swagger/json',
      },
    }),
  );

  app.use('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /uploads-acad/\nDisallow: /*.webp$');
  });

  app.enableShutdownHooks();

  const port = process.env.PORT || 3002;
  await app.listen(port);
}

bootstrap();
