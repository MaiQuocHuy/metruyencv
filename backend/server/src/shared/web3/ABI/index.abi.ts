import { CIDStorageABI } from './CIDStorage.abi';
import { OwnerABI } from './owner.abi';
import { FactoryABI } from './factory.abi';

const ABIs = {
  CIDStorage: CIDStorageABI,
  Owner: OwnerABI,
  Factory: FactoryABI,
};

// Hàm lấy ABI theo contract name
export const getABI = (contractName: string) => {
  const abi = ABIs[contractName];
  if (!abi) throw new Error(`ABI for contract ${contractName} not found`);
  return abi;
};
