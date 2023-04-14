require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  allowUnlimitedContractSize: true,
  networks: {
    hardhat: {},
    POLYGON_ZKEVM_MAINNET: {
      accounts: [`${process.env.PRIVATE_KEY}`],
      url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    },
    POLYGON_ZKEVM_TESTNET: {
      accounts: [`${process.env.PRIVATE_KEY}`],
      url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    },
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
};
