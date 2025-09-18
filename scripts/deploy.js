const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const BetterCoin = await ethers.getContractFactory("BetterCoin");
  const token = await BetterCoin.deploy(deployer.address);
  await token.waitForDeployment();

  console.log("BetterCoin deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
