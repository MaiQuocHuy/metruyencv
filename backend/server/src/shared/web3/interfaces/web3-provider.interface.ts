import { ethers } from 'ethers';

export interface IWeb3Provider {
  provider: ethers.JsonRpcProvider;
  wallet: ethers.Wallet;
  getContract: (
    contractName: string,
    contractAddress: string,
  ) => ethers.Contract;
}
