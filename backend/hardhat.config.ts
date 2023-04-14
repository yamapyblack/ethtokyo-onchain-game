import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  // allowUnlimitedContractSize: true,
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
    coinmarketcap: process.env.CMC_API,
  },
  networks: {
    hardhat: {},
    POLYGON_ZKEVM_MAINNET: {
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 1101,
      url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    },
    POLYGON_ZKEVM_TESTNET: {
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 1442,
      url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    },
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
};

export default config;
