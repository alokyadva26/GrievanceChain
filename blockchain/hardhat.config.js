require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // 👈 This line is the "Magic Fix"

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // Use your actual version
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org", // Or your Alchemy/Infura URL
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};