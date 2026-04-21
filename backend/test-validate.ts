import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AuthService } from './src/auth/auth.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const result = await authService.validateUser('nick.fury@slooze.com', 'password123');
  console.log('Final Result:', result);
  await app.close();
}
main().catch(console.error);
