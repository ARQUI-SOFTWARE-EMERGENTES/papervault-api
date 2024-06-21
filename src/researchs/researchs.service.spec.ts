import { Test, TestingModule } from '@nestjs/testing';
import { ResearchsService } from './researchs.service';

describe('ResearchsService', () => {
  let service: ResearchsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResearchsService],
    }).compile();

    service = module.get<ResearchsService>(ResearchsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
