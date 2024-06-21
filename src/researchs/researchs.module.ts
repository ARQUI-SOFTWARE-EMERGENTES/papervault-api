import { Module } from '@nestjs/common';
import { ResearchsController } from './researchs.controller';
import { ResearchsService } from './researchs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Research, ResearchSchema } from 'src/schemas/Research.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Researcher, ResearcherSchema } from 'src/schemas/Researcher.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Research.name,
        schema: ResearchSchema
      },
      {
        name: Researcher.name,
        schema: ResearcherSchema
      }
    ])
  ],
  controllers: [ResearchsController],
  providers: [ResearchsService]
})
export class ResearchsModule {}
