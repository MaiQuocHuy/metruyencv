import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const secondary = new KeyvRedis(process.env.REDIS_URL, {
          namespace: 'user',
        });
        secondary.on('error', CacheModule.handleConnectionError);
        return new Cacheable({ secondary });
      },
    },
    CacheService,
  ],
  exports: ['CACHE_INSTANCE', CacheService],
})
export class CacheModule {
  static handleConnectionError = (err: Error): void =>
    console.log('Connection Error', err);
  static handleClear = () => {
    console.log('Cache Cleared');
  };
  static handleDisconnect = () => console.log('Disconnected');
}
