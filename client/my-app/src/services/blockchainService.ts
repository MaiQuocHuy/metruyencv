import { ethers } from 'ethers';
import { historyData } from '@/lib/data/data';
import { HistoryEntry, MangaChange } from '@/types/history';
import { metadata } from '../app/layout';

// Interface for blockchain connection configuration
export interface BlockchainConfig {
  rpcUrl: string;
  contractAddress: string;
  apiKey?: string;
}

interface VersionInfo {
  version: number;
  cid: string;
}

export interface PaginatedResult<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: T[];
}

const fetchBlockchainConfig = async () => {
  try {
    const response = await fetch('/api/blockchain/config');
    if (!response.ok) {
      throw new Error('Failed to fetch blockchain configuration');
    }
    const config = await response.json();
    console.log('Config', config);
    return config.metadata;
  } catch (error) {
    console.error('Error fetching blockchain config:', error);

    return null;
  }
};

// Default configuration
const defaultConfig: BlockchainConfig = {
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:7545',
  contractAddress:
    process.env.CONTRACT_ADDRESS || '0xa556FDe944c946B89F36303aa35CB00ee7457B50'
};

// Contract ABI for interacting with the smart contract
const ABI = [
  'event StoryUpdated(uint256 indexed storyId, string cid, uint256 indexed timestamp)',
  'function updateStory(uint256 storyId, string memory newCID, address _ownerContract) public'
];

/**
 * Service to interact with blockchain for manga history data
 */
class BlockchainService {
  private config: BlockchainConfig;
  private provider: ethers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;

  constructor(config: BlockchainConfig = defaultConfig) {
    this.config = config;
  }

  /**
   * Initialize connection to blockchain
   */
  async connect(): Promise<boolean> {
    console.log(`Connecting to blockchain at ${this.config.rpcUrl}`);
    try {
      // Initialize the provider
      this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
      const address = await fetchBlockchainConfig();
      // Initialize the contract
      this.contract = new ethers.Contract(
        // this.config.contractAddress,
        address,
        ABI,
        this.provider
      );

      // Test connection by getting the network
      const network = await this.provider.getNetwork();
      console.log(`Connected to network: ${network.name} (${network.chainId})`);

      return true;
    } catch (error) {
      console.log('Failed to connect to blockchain:', error);
      this.provider = null;
      this.contract = null;
      return false;
    }
  }

  /**
   * Fetch a specific history entry by CID
   */
  async getHistoryByCID(cid: string): Promise<HistoryEntry | null> {
    try {
      console.log(`Fetching history with CID: ${cid}`);

      if (!cid) {
        console.log('No CID provided');
        return null;
      }

      // Fetch the data from IPFS
      return await this.fetchIPFSData(cid);
    } catch (error) {
      console.error(`Error fetching history with CID ${cid}:`, error);
      return null;
    }
  }

  /**
   * Get the latest version of a manga by ID
   */
  async getLatestMangaVersion(mangaId: number): Promise<HistoryEntry | null> {
    try {
      console.log(`Fetching latest version of manga ID: ${mangaId}`);

      if (!this.contract) {
        await this.connect();
        if (!this.contract) {
          throw new Error('Failed to establish blockchain connection');
        }
      }

      // Create a filter for StoryUpdated events with the specific mangaId
      const filter = this.contract.filters.StoryUpdated(mangaId);

      // Query all events matching the filter from block 0 to latest
      const events: any = await this.contract.queryFilter(filter, 0, 'latest');

      if (events.length === 0) {
        console.log(`No events found for manga ID: ${mangaId}`);
        return null;
      }
      //test
      const totalEventsCount = events.length;
      console.log('Total events:', totalEventsCount);

      // Get the latest event (last in the array)
      const latestEvent = events[events.length - 1];
      console.log('Latest event:', latestEvent);
      const sortedEvents = events.sort(
        (a: any, b: any) => b.blockNumber - a.blockNumber
      );

      // Lấy 5 event mới nhất
      const latestFiveEvents = sortedEvents.slice(0, 5);
      for (const event of latestFiveEvents) {
        console.log('Event:', event.args[1]);
      }
      console.log('latestFiveEvents', latestFiveEvents);
      //test
      // Extract data from the event
      const eventData = {
        storyId: latestEvent.args[0].toString(),
        cid: latestEvent.args[1],
        timestamp: latestEvent.args[2].toString()
      };

      console.log('Latest event data:', eventData);

      // Fetch the corresponding history entry using the CID from the event
      const historyEntry = await this.fetchIPFSData(eventData.cid);

      return historyEntry;
    } catch (error) {
      console.error(
        `Error fetching latest manga version for ID ${mangaId}:`,
        error
      );
      return null;
    }
  }

  async getPaginatedEvents(
    mangaId: string,
    page: number = 1,
    limit: number = 5
  ): Promise<PaginatedResult<any> | null> {
    console.log(`Fetching latest version of manga ID: ${mangaId}`);

    if (!this.contract) {
      await this.connect();
      if (!this.contract) {
        throw new Error('Failed to establish blockchain connection');
      }
    }

    const filter = this.contract.filters.StoryUpdated(mangaId);

    const events = await this.contract.queryFilter(filter, 0, 'latest');

    if (events.length === 0) {
      console.log(`No events found for manga ID: ${mangaId}`);
      return null;
    }

    const sortedEvents = events.sort((a, b) => b.blockNumber - a.blockNumber);

    const total = sortedEvents.length;
    const totalPages = Math.ceil(total / limit);

    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = sortedEvents.slice(startIndex, endIndex);

    return {
      total,
      page: currentPage,
      limit,
      totalPages,
      data: paginatedEvents
    };
  }

  /**
   * Fetch data from IPFS using the CID
   * @param cid - Content Identifier for IPFS
   * @returns The history entry or null if not found
   */
  async fetchIPFSData(cid: string): Promise<HistoryEntry | null> {
    try {
      if (!cid) return null;

      console.log(`Fetching IPFS data for CID: ${cid}`);

      // Use the IPFS gateway to fetch the data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_IPFS}${cid}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS content (${response.status})`);
      }

      const data: HistoryEntry = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching IPFS data for CID ${cid}:`, error);
      return null;
    }
  }

  /**
   * Get the complete version history for a manga
   * @param latestCid - The CID of the latest version
   * @param page - The page number (starting from 1)
   * @param pageSize - Number of versions per page
   * @returns Object containing array of version history entries and pagination metadata
   */
  async getCompleteVersionHistory(latestCid: string): Promise<{
    history: HistoryEntry[];
    page?: number;
    pageSize?: number;
  }> {
    if (!latestCid) {
      return {
        history: []
      };
    }

    // const page: number = 1; // default page
    // const pageSize = page === 1 ? 4 : 5;
    // const startIndex = (page - 1) * pageSize;
    // const endIndex = startIndex + pageSize;

    try {
      // Fetch first entry
      const firstEntry = await this.fetchIPFSData(latestCid);
      if (!firstEntry) throw new Error('Failed to fetch initial entry');

      // Use Set to store unique versions
      const processedVersions = new Set<number>();
      const historyEntries: HistoryEntry[] = [];

      // Add first entry
      processedVersions.add(firstEntry.version);
      historyEntries.push(firstEntry);
      console.log('First entry:', firstEntry);

      // Process recent versions
      let currentEntry: HistoryEntry | null = firstEntry;
      while (currentEntry?.previousVersion) {
        const nextEntry = await this.fetchIPFSData(
          currentEntry.previousVersion
        );
        if (nextEntry && !processedVersions.has(nextEntry.version)) {
          processedVersions.add(nextEntry.version);
          historyEntries.push(nextEntry);
          currentEntry = nextEntry;
        } else {
          currentEntry = null; // Break the loop if we get null or duplicate version
        }
      }

      //Test
      // Process versions until we have enough for the requested page
      // let currentEntry: HistoryEntry | null = firstEntry;
      // while (
      //   currentEntry?.previousVersion &&
      //   historyEntries.length < endIndex + 1
      // ) {
      //   const nextEntry = await this.fetchIPFSData(
      //     currentEntry.previousVersion
      //   );
      //   if (nextEntry && !processedVersions.has(nextEntry.version)) {
      //     processedVersions.add(nextEntry.version);
      //     historyEntries.push(nextEntry);
      //     currentEntry = nextEntry;
      //   } else {
      //     currentEntry = null; // Break the loop if we get null or duplicate version
      //   }
      // }
      //--endtest

      // Sort entries by version (descending)
      historyEntries.sort((a, b) => b.version - a.version);
      //Test
      // const totalItems = historyEntries.length;
      // const totalPages = Math.ceil(totalItems / pageSize);
      // const hasMore = currentEntry?.previousVersion != null;

      // // Get items for the requested page
      // const paginatedHistory = historyEntries.slice(startIndex, endIndex);
      // console.log('Paginated history:', paginatedHistory);
      // console.log('Total pages:', totalPages);
      // console.log('Has more:', hasMore);
      // console.log('Total items:', totalItems);
      // console.log('historyEntries', historyEntries);
      // const pagination = {
      //   currentPage: page,
      //   totalPages,
      //   totalItems,
      //   hasMore
      // };
      // console.log('Pagination:', pagination, paginatedHistory);

      //EndTest
      return {
        history: historyEntries
      };
    } catch (error) {
      console.error('Error fetching version history:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const blockchainService = new BlockchainService();

// Export the class for custom instantiation
export default BlockchainService;
