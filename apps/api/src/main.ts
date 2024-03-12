import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { PORT = '4000' } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(+PORT, async () => {
    console.log(`Listening at ${await app.getUrl()} 🚀 💯`);
  });
}
bootstrap();
