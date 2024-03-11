import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
		origin: process.env.CORS_HOST,
		methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
		credentials: true,
		optionsSuccessStatus: 204, 
		allowedHeaders:
			"Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
	});
  app.use(cookieParser());
  await app.listen(3000, '0.0.0.0', void function (err: Error) {
    if (err) throw err
    console.log(`Listening on port ${3000}`);
  })
}
bootstrap();
