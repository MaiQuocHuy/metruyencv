import { Test, TestingModule } from '@nestjs/testing';
import { Pinata } from './pinata.provider';

describe('Pinata', () => {
  let provider: Pinata;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Pinata],
    }).compile();

    provider = module.get<Pinata>(Pinata);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
