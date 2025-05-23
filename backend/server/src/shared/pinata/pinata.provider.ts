import { PinataSDK } from 'pinata-web3';
import { ConfigService } from '@nestjs/config';

export const PinataProvider = {
  provide: 'PINATA_SDK',
  useFactory: (configService: ConfigService) => {
    return new PinataSDK({
      pinataJwt: configService.get<string>('PINATA_JWT'),
      pinataGateway: configService.get<string>('PINATA_GATEWAY_URL'),
    });
  },
  inject: [ConfigService], // Inject NestJS ConfigService
};
