import { Global, Module } from '@nestjs/common';
// import keyTokenService from './services/keyToken.service';
import Util from '@common/services/util.service';

@Global()
@Module({
  providers: [Util],
  exports: [Util],
})
export class CommonModule {}
