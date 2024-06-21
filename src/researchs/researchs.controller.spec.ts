import { Test, TestingModule } from '@nestjs/testing';
import { ResearchsController } from './researchs.controller';

describe('ResearchsController', () => {
  let controller: ResearchsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResearchsController],
    }).compile();

    controller = module.get<ResearchsController>(ResearchsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
