import { Inject, Injectable } from '@nestjs/common';
import { IWeb3Provider } from './interfaces/web3-provider.interface';
import { ConfigService } from '@nestjs/config';
import { ContractName as ContractNameConst } from '@common/constants';
import { ContractTransaction, ethers } from 'ethers';

@Injectable()
export class Web3Service {
  constructor(
    @Inject('WEB3')
    private readonly web3: IWeb3Provider,
    private readonly configService: ConfigService,
  ) {}

  async getOwner() {
    const contract = await this.getContract(ContractNameConst.OWNER);
    return await contract.getOwner();
  }

  async updateManga(
    mangaId: number,
    cid: string,
  ): Promise<ContractTransaction> {
    const ownerContractAddress = await this.getContractAddressByName(
      ContractNameConst.OWNER,
    );
    const contract = await this.getContract(ContractNameConst.CID_STORAGE);
    const tx = await contract.updateStory(mangaId, cid, ownerContractAddress);
    await tx.wait();
    return tx;
  }

  async checkIsOwner() {
    const contract = await this.getContract(ContractNameConst.OWNER);
    return await contract.checkIsOwner();
  }

  async getContract(contractName: string): Promise<ethers.Contract> {
    const contractAddress = await this.getContractAddressByName(contractName);
    const contract = this.web3.getContract(contractName, contractAddress);

    return contract;
  }

  async getDataLatestBlockOfMangaUpdateByMangaId(
    mangaId: number,
  ): Promise<any> {
    const contract = await this.getContract(ContractNameConst.CID_STORAGE);

    // Truy vấn tất cả các events phù hợp với filter
    const filter = contract.filters.StoryUpdated(mangaId);
    const events = await contract.queryFilter(filter, 0, 'latest');
    const event = events[events.length - 1];
    if ('args' in event) {
      return {
        storyId: event.args[0].toString(),
        cid: event.args[1],
        timestamp: event.args[2].toString(),
      };
    } else {
      return null;
    }
  }

  async getContractAddressByName(contractName: string) {
    const contract = this.web3.getContract(
      ContractNameConst.FACTORY,
      this.configService.get<string>('FACTORY_CONTRACT_ADDRESS'),
    );
    const contractAddress = await contract.getContractByName(contractName);
    return contractAddress;
  }
}
