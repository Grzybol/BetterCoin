const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const BetterCoinModule = buildModule("BetterCoinModule", (m) => {
  // Deploy the BetterCoin contract
  const betterCoin = m.contract("BetterCoin", []);

  return { betterCoin };
});

module.exports = BetterCoinModule;