import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CacheService } from './shared/cache/cache.service';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly cacheService: CacheService) {}
  async onModuleInit() {
    await this.deleteGrantListCache();
  }

  async deleteGrantListCache() {
    await this.cacheService.delete('grants_list');
  }
}
