import { Test, TestingModule } from '@nestjs/testing';
import { ErrorReportService } from './error-report.service';

describe('ErrorReportService', () => {
  let service: ErrorReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorReportService],
    }).compile();

    service = module.get<ErrorReportService>(ErrorReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
