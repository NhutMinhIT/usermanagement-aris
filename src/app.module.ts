import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DATABASE_HOST');
        Logger.log(`Connecting to MongoDB at ${uri}`, 'MongooseModule');
        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
  ],
})
export class AppModule { }