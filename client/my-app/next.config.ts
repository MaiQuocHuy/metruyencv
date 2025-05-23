import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gold-blank-bovid-152.mypinata.cloud',
        pathname: '/ipfs/**',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '/ipfs/**',
        port: ''
      },
      {
        protocol: 'https',
        hostname: '**'
      }
    ],
    minimumCacheTTL: 60
  }
};

export default nextConfig;
