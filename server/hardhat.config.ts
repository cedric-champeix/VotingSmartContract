import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import "hardhat-gas-reporter";
import "solidity-coverage"
import "@nomicfoundation/hardhat-verify";

import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY.length > 0 ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      accounts: PRIVATE_KEY.length > 0 ? [PRIVATE_KEY] : [],
      chainId: 31337,
    },
  },
  gasReporter: {
    enabled: true,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.28',
        settings: {
          optimizer: {
            enabled: true,
            runs: 50,
          },
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
};

export default config;