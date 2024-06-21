import { Module } from '@nestjs/common';
import { ResearchsModule } from './researchs/researchs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ResearchersModule } from './researchers/researchers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return { uri: configService.get<string>('MONGODB_URI')}
      }
    }),
    ResearchsModule,
    AuthModule,
    ResearchersModule]
    
})
export class AppModule {}
