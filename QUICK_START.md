# BetterCoin (MBC) - Quick Start Guide

## 🎯 What is BetterCoin?

BetterCoin (MBC) is a secure ERC-20 token designed for Minecraft server economies. It features:
- 1,000,000 initial token supply
- Owner-controlled minting and burning
- OpenZeppelin security standards
- Full backend integration for Minecraft servers

## 🚀 Quick Start (5 minutes)

### 1. Setup Project
```bash
git clone <repository-url>
cd BetterCoin
npm install
```

### 2. Run Demo
```bash
./demo.sh
```

This will:
- ✅ Install dependencies
- ✅ Compile contracts
- ✅ Run tests
- ✅ Deploy locally
- ✅ Test interactions

### 3. Deploy to Testnet
```bash
# Configure .env file
cp .env.example .env
# Edit .env with your Sepolia RPC URL and private key

# Deploy to Sepolia
npm run deploy:sepolia
```

## 📱 Key Features

### Smart Contract Functions
- `mint(address, amount)` - Owner only
- `burn(address, amount)` - Owner only  
- `burnOwnTokens(amount)` - Any user
- `transfer(address, amount)` - Standard ERC-20
- `getTokenInfo()` - Get all token details

### Backend APIs
Ready-to-use APIs in multiple languages:
- **Node.js/Express**: `examples/backend/nodejs-express/`
- **Java Spring Boot**: `examples/backend/java-spring/`
- **Go**: `examples/backend/go-api/`

### Key Endpoints
- `GET /api/v1/balance/{address}` - Check token balance
- `GET /api/v1/minecraft/can-afford/{address}/{cost}` - Gaming integration
- `POST /api/v1/balances` - Bulk balance check

## 🎮 Minecraft Integration

### 1. Start Backend API
```bash
cd examples/backend/nodejs-express
npm install
npm start
```

### 2. Use in Your Plugin
```java
// Check if player can afford item
String response = httpGet("http://localhost:3000/api/v1/minecraft/can-afford/" + 
    playerWallet + "/" + itemCost);
JsonObject result = JsonParser.parseString(response).getAsJsonObject();

if (result.get("canAfford").getAsBoolean()) {
    // Allow purchase
    player.sendMessage("Item purchased with MBC!");
} else {
    // Deny purchase  
    player.sendMessage("Insufficient MBC tokens!");
}
```

## 🔧 Development Commands

```bash
# Core commands
npm run compile        # Compile contracts
npm run test          # Run test suite
npm run node          # Start local blockchain

# Deployment
npm run deploy:hardhat    # Deploy locally
npm run deploy:sepolia    # Deploy to testnet

# Testing
npm run test:interactions # Test contract functions
```

## 📊 Contract Details

- **Address**: (Set after deployment)
- **Name**: BetterCoin
- **Symbol**: MBC
- **Decimals**: 18
- **Initial Supply**: 1,000,000 MBC
- **Network**: Ethereum/Polygon/Sepolia

## 🛡️ Security Features

✅ OpenZeppelin contracts  
✅ Owner-only admin functions  
✅ Input validation  
✅ Event logging  
✅ Comprehensive tests  
✅ No known vulnerabilities  

## 📖 Documentation

- **README.md** - Complete documentation
- **docs/metamask-guide.md** - MetaMask setup
- **docs/remix-guide.md** - Remix IDE usage
- **examples/backend/** - API integrations

## 🆘 Troubleshooting

### Common Issues

**Q: Compilation fails**
A: Network issue downloading Solidity compiler. Try again or use pre-compiled artifacts.

**Q: Tests fail**  
A: Usually due to compilation issues. Deploy and test manually if needed.

**Q: MetaMask not connecting**
A: Check network configuration and contract address.

**Q: Backend API errors**
A: Verify RPC URL and contract address in environment variables.

### Getting Help

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review documentation in `docs/` folder  
3. Test with the demo script first
4. Verify environment configuration

## ✅ Production Checklist

Before mainnet deployment:

- [ ] Test on Sepolia testnet
- [ ] Verify contract on Etherscan
- [ ] Test all backend integrations
- [ ] Configure proper RPC endpoints
- [ ] Set up monitoring
- [ ] Prepare wallet with ETH for gas
- [ ] Backup private keys securely

## 🎉 Success Metrics

After setup, you should have:
- ✅ Deployed BetterCoin contract
- ✅ Working backend API
- ✅ MetaMask integration
- ✅ Minecraft plugin compatibility
- ✅ Complete documentation

---

**Ready to revolutionize your Minecraft economy with blockchain technology!** 🚀