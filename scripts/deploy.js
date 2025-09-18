const hre = require("hardhat");
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Deploying BetterCoin (MBC) token...");

  // Get the contract factory
  const BetterCoin = await ethers.getContractFactory("BetterCoin");

  // Deploy the contract
  const betterCoin = await BetterCoin.deploy();
  
  // Wait for deployment to be mined
  await betterCoin.waitForDeployment();

  const contractAddress = await betterCoin.getAddress();
  console.log(`BetterCoin deployed to: ${contractAddress}`);

  // Get deployment info
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const network = hre.network.name;
  
  console.log(`Deployed by: ${deployerAddress}`);
  console.log(`Network: ${network}`);

  // Get token information
  const name = await betterCoin.name();
  const symbol = await betterCoin.symbol();
  const totalSupply = await betterCoin.totalSupply();
  const decimals = await betterCoin.decimals();
  const owner = await betterCoin.owner();

  console.log("\n=== Token Information ===");
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Decimals: ${decimals}`);
  console.log(`Total Supply: ${ethers.formatEther(totalSupply)} ${symbol}`);
  console.log(`Owner: ${owner}`);

  // Verify balance of deployer
  const deployerBalance = await betterCoin.balanceOf(deployerAddress);
  console.log(`Deployer Balance: ${ethers.formatEther(deployerBalance)} ${symbol}`);

  console.log("\n=== Deployment Complete ===");
  
  // Save deployment info to file
  const deploymentInfo = {
    contractAddress: contractAddress,
    contractName: "BetterCoin",
    deployer: deployerAddress,
    network: network,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    tokenInfo: {
      name: name,
      symbol: symbol,
      decimals: decimals,
      totalSupply: totalSupply.toString(),
      owner: owner
    }
  };

  const deploymentDir = path.join(__dirname, '../deployments');
  
  // Create deployments directory if it doesn't exist
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentDir, `${network}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`Deployment info saved to: ${deploymentFile}`);
  
  return contractAddress;
}

// Handle errors
main()
  .then((contractAddress) => {
    console.log(`\nBetterCoin successfully deployed at: ${contractAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error deploying BetterCoin:", error);
    process.exit(1);
  });