import { Module } from '@nestjs/common';
import { ResearchersController } from './researchers.controller';
import { ResearchersService } from './researchers.service';
import { Researcher, ResearcherSchema } from 'src/schemas/Researcher.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Researcher.name,
        schema: ResearcherSchema
      }
    ])
  ],
  controllers: [ResearchersController],
  providers: [ResearchersService]
})
export class ResearchersModule {}
