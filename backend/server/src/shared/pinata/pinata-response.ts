// cloudinary-response.ts
import {
  PinResponse,
  GroupResponseItem,
  GetCIDResponse,
  UnpinResponse,
} from 'pinata-web3';

export type PinataResponse =
  | PinResponse
  | GroupResponseItem
  | GetCIDResponse
  | UnpinResponse;
