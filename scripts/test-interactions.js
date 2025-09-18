const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing BetterCoin contract interactions...\n");

  // Get deployment info
  const network = hre.network.name;
  const fs = require('fs');
  const path = require('path');
  const deploymentFile = path.join(__dirname, '../deployments', `${network}-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Deployment file not found: ${deploymentFile}`);
    console.log("Please deploy the contract first using: npm run deploy:hardhat");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  const contractAddress = deploymentInfo.contractAddress;

  console.log(`🏗  Using contract at: ${contractAddress}`);

  // Get contract instance
  const BetterCoin = await ethers.getContractFactory("BetterCoin");
  const betterCoin = BetterCoin.attach(contractAddress);

  // Get signers
  const [owner, user1, user2] = await ethers.getSigners();
  
  console.log(`👤 Owner: ${owner.address}`);
  console.log(`👤 User1: ${user1.address}`);
  console.log(`👤 User2: ${user2.address}\n`);

  try {
    // 1. Check initial state
    console.log("1️⃣ Checking initial contract state...");
    const name = await betterCoin.name();
    const symbol = await betterCoin.symbol();
    const decimals = await betterCoin.decimals();
    const totalSupply = await betterCoin.totalSupply();
    const contractOwner = await betterCoin.owner();
    
    console.log(`   Name: ${name}`);
    console.log(`   Symbol: ${symbol}`);
    console.log(`   Decimals: ${decimals}`);
    console.log(`   Total Supply: ${ethers.formatEther(totalSupply)} ${symbol}`);
    console.log(`   Owner: ${contractOwner}\n`);

    // 2. Check owner balance
    console.log("2️⃣ Checking owner balance...");
    const ownerBalance = await betterCoin.balanceOf(owner.address);
    console.log(`   Owner balance: ${ethers.formatEther(ownerBalance)} ${symbol}\n`);

    // 3. Transfer tokens to users
    console.log("3️⃣ Transferring tokens to test users...");
    const transferAmount1 = ethers.parseEther("1000");
    const transferAmount2 = ethers.parseEther("500");
    
    await betterCoin.transfer(user1.address, transferAmount1);
    console.log(`   ✅ Transferred ${ethers.formatEther(transferAmount1)} ${symbol} to User1`);
    
    await betterCoin.transfer(user2.address, transferAmount2);
    console.log(`   ✅ Transferred ${ethers.formatEther(transferAmount2)} ${symbol} to User2\n`);

    // 4. Check balances after transfer
    console.log("4️⃣ Checking balances after transfers...");
    const user1Balance = await betterCoin.balanceOf(user1.address);
    const user2Balance = await betterCoin.balanceOf(user2.address);
    console.log(`   User1 balance: ${ethers.formatEther(user1Balance)} ${symbol}`);
    console.log(`   User2 balance: ${ethers.formatEther(user2Balance)} ${symbol}\n`);

    // 5. Test minting (owner only)
    console.log("5️⃣ Testing minting functionality...");
    const mintAmount = ethers.parseEther("2000");
    await betterCoin.mint(user1.address, mintAmount);
    console.log(`   ✅ Minted ${ethers.formatEther(mintAmount)} ${symbol} to User1`);
    
    const newUser1Balance = await betterCoin.balanceOf(user1.address);
    console.log(`   User1 new balance: ${ethers.formatEther(newUser1Balance)} ${symbol}\n`);

    // 6. Test self-burning
    console.log("6️⃣ Testing self-burning functionality...");
    const burnAmount = ethers.parseEther("300");
    await betterCoin.connect(user2).burnOwnTokens(burnAmount);
    console.log(`   ✅ User2 burned ${ethers.formatEther(burnAmount)} ${symbol} from own balance`);
    
    const newUser2Balance = await betterCoin.balanceOf(user2.address);
    console.log(`   User2 new balance: ${ethers.formatEther(newUser2Balance)} ${symbol}\n`);

    // 7. Test owner burning
    console.log("7️⃣ Testing owner burning functionality...");
    const ownerBurnAmount = ethers.parseEther("100");
    await betterCoin.burn(user1.address, ownerBurnAmount);
    console.log(`   ✅ Owner burned ${ethers.formatEther(ownerBurnAmount)} ${symbol} from User1`);
    
    const finalUser1Balance = await betterCoin.balanceOf(user1.address);
    console.log(`   User1 final balance: ${ethers.formatEther(finalUser1Balance)} ${symbol}\n`);

    // 8. Test getTokenInfo function
    console.log("8️⃣ Testing getTokenInfo function...");
    const tokenInfo = await betterCoin.getTokenInfo();
    console.log(`   Token Info - Name: ${tokenInfo.name_}, Symbol: ${tokenInfo.symbol_}`);
    console.log(`   Decimals: ${tokenInfo.decimals_}, Total Supply: ${ethers.formatEther(tokenInfo.totalSupply_)}`);
    console.log(`   Contract Owner: ${tokenInfo.owner_}\n`);

    // 9. Final state summary
    console.log("9️⃣ Final contract state summary...");
    const finalTotalSupply = await betterCoin.totalSupply();
    const finalOwnerBalance = await betterCoin.balanceOf(owner.address);
    const finalUser1BalanceCheck = await betterCoin.balanceOf(user1.address);
    const finalUser2BalanceCheck = await betterCoin.balanceOf(user2.address);
    
    console.log(`   📊 Final Total Supply: ${ethers.formatEther(finalTotalSupply)} ${symbol}`);
    console.log(`   💰 Owner Balance: ${ethers.formatEther(finalOwnerBalance)} ${symbol}`);
    console.log(`   💰 User1 Balance: ${ethers.formatEther(finalUser1BalanceCheck)} ${symbol}`);
    console.log(`   💰 User2 Balance: ${ethers.formatEther(finalUser2BalanceCheck)} ${symbol}\n`);

    console.log("✅ All tests completed successfully!");
    console.log("🎉 BetterCoin contract is working as expected!");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\n🏁 Test script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test script failed:", error);
    process.exit(1);
  });