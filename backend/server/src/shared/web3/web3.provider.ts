import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { getABI } from './ABI/index.abi';
import { IWeb3Provider } from './interfaces/web3-provider.interface';

export const Web3Provider = {
  provide: 'WEB3',
  useFactory: (configService: ConfigService): IWeb3Provider => {
    const rpcUrl = configService.get<string>('RPC_URL');
    const privateKey = configService.get<string>('YOUR_PRIVATE_KEY');

    if (!rpcUrl || !privateKey) {
      throw new Error('Missing required Web3 environment variables');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Initialize contract instance
    const getContract = (contractName: string, contractAddress: string) => {
      const abi = getABI(contractName);
      return new ethers.Contract(contractAddress, abi, wallet);
    };

    return { provider, wallet, getContract };
  },
  inject: [ConfigService],
};
