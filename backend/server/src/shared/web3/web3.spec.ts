import { Test, TestingModule } from '@nestjs/testing';
import { Web3 } from './web3.provider';

describe('Web3', () => {
  let provider: Web3;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Web3],
    }).compile();

    provider = module.get<Web3>(Web3);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
