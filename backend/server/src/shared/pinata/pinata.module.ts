import { Module } from '@nestjs/common';
import { PinataService } from './pinata.service';
import { PinataProvider } from './pinata.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PinataService, PinataProvider],
  exports: [PinataService],
})
export class PinataModule {}
