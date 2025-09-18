const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const network = hre.network.name;
  console.log(`Verifying BetterCoin contract on ${network} network...`);

  // Read deployment info
  const deploymentFile = path.join(__dirname, '../deployments', `${network}-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`Deployment file not found: ${deploymentFile}`);
    console.log("Please deploy the contract first using: npx hardhat run scripts/deploy.js --network <network>");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  const contractAddress = deploymentInfo.contractAddress;

  if (!contractAddress) {
    console.error("Contract address not found in deployment file");
    process.exit(1);
  }

  console.log(`Contract Address: ${contractAddress}`);

  try {
    // Verify the contract on Etherscan (or equivalent block explorer)
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // BetterCoin constructor has no arguments
    });
    
    console.log("✅ Contract verified successfully!");
    
    // Update deployment info with verification status
    deploymentInfo.verified = true;
    deploymentInfo.verificationTimestamp = new Date().toISOString();
    
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log(`Verification status updated in: ${deploymentFile}`);
    
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
      
      if (error.message.toLowerCase().includes("api key")) {
        console.log("\n💡 Make sure you have set ETHERSCAN_API_KEY in your environment variables");
        console.log("   For Sepolia: export ETHERSCAN_API_KEY=your_etherscan_api_key");
      }
      
      if (error.message.toLowerCase().includes("network")) {
        console.log("\n💡 Verification is only available on supported networks (mainnet, sepolia, etc.)");
        console.log("   Local networks cannot be verified on Etherscan");
      }
    }
  }
}

main()
  .then(() => {
    console.log("\nVerification process completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during verification:", error);
    process.exit(1);
  });