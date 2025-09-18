# BetterCoin (MBC) - ERC-20 Token for Minecraft Ecosystem

![BetterCoin Logo](https://img.shields.io/badge/BetterCoin-MBC-blue?style=for-the-badge)
![Solidity](https://img.shields.io/badge/Solidity-0.8.19-green?style=flat-square)
![Hardhat](https://img.shields.io/badge/Hardhat-Development-orange?style=flat-square)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-Security-red?style=flat-square)

BetterCoin (MBC) is a secure, ERC-20 compatible token designed specifically for Minecraft server economies. It features owner-controlled minting and burning capabilities, making it perfect for gaming ecosystems where administrators need to manage token supply dynamically.

## 🚀 Features

- **ERC-20 Compatible**: Full compliance with ERC-20 standard
- **Owner-Controlled Minting**: Only contract owner can mint new tokens
- **Flexible Burning**: Owner can burn from any address, users can burn their own tokens
- **Initial Supply**: 1,000,000 MBC tokens minted to deployer
- **OpenZeppelin Security**: Built on battle-tested OpenZeppelin contracts
- **Comprehensive Testing**: Full test suite with Hardhat and Chai
- **Multi-Network Support**: Deploy to local, testnet, or mainnet
- **Backend Integration**: Ready-to-use APIs for Minecraft servers

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Smart Contract](#smart-contract)
- [Deployment](#deployment)
- [Testing](#testing)
- [Integration Guides](#integration-guides)
- [Backend APIs](#backend-apis)
- [Security](#security)
- [Contributing](#contributing)

## 🏁 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/BetterCoin.git
cd BetterCoin

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Compile contracts
npm run compile

# Run tests
npm run test
```

### Deploy Locally

```bash
# Start local Hardhat network
npm run node

# In another terminal, deploy to local network
npm run deploy:hardhat
```

## 🛠 Installation

### 1. Clone and Install

```bash
git clone https://github.com/your-username/BetterCoin.git
cd BetterCoin
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Sepolia testnet configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Gas reporting (optional)
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
```

### 3. Compile Contracts

```bash
npm run compile
```

## 📱 Smart Contract

### BetterCoin Contract Features

The BetterCoin contract includes:

- **Standard ERC-20 Functions**: `transfer`, `approve`, `transferFrom`, etc.
- **Minting**: `mint(address to, uint256 amount)` - Owner only
- **Burning**: `burn(address from, uint256 amount)` - Owner only
- **Self-Burning**: `burnOwnTokens(uint256 amount)` - Any user
- **Token Info**: `getTokenInfo()` - Returns comprehensive token details

### Key Specifications

- **Name**: BetterCoin
- **Symbol**: MBC
- **Decimals**: 18
- **Initial Supply**: 1,000,000 MBC
- **Max Supply**: Unlimited (owner-controlled minting)

### Contract Code Overview

```solidity
contract BetterCoin is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18;
    
    constructor() ERC20("BetterCoin", "MBC") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    function mint(address to, uint256 amount) public onlyOwner { ... }
    function burn(address from, uint256 amount) public onlyOwner { ... }
    function burnOwnTokens(uint256 amount) public { ... }
}
```

## 🚀 Deployment

### Local Development

```bash
# Start local Hardhat network
npm run node

# Deploy to local network
npm run deploy:hardhat

# The contract address will be displayed and saved to deployments/
```

### Sepolia Testnet

```bash
# Configure your .env file with Sepolia RPC URL and private key
# Deploy to Sepolia
npm run deploy:sepolia

# Verify contract (optional)
npm run verify:sepolia
```

### Mainnet Deployment

⚠️ **Warning**: Mainnet deployment uses real ETH. Double-check everything!

```bash
# Configure mainnet RPC URL and private key in .env
# Deploy to mainnet (when ready)
npx hardhat run scripts/deploy.js --network mainnet
```

### Using Hardhat Ignition

Alternatively, use Hardhat's Ignition deployment system:

```bash
npx hardhat ignition deploy ignition/modules/BetterCoin.js --network sepolia
```

## 🧪 Testing

BetterCoin includes comprehensive tests covering all functionality:

### Run All Tests

```bash
npm run test
```

### Test Categories

- **Deployment Tests**: Verify initial state and ownership
- **Minting Tests**: Test owner-only minting functionality
- **Burning Tests**: Test owner burning and self-burning
- **Transfer Tests**: Validate ERC-20 transfer mechanics
- **Access Control**: Verify ownership and permission controls

### Test Coverage

```bash
# Run tests with coverage report
npx hardhat coverage
```

## 📖 Integration Guides

### MetaMask Integration

See [MetaMask Integration Guide](docs/metamask-guide.md) for detailed instructions on:
- Network configuration
- Adding BetterCoin to MetaMask
- Sending and receiving tokens
- Troubleshooting common issues

### Remix IDE Integration

See [Remix Integration Guide](docs/remix-guide.md) for:
- Importing and compiling contracts
- Deploying to testnet
- Interacting with deployed contracts
- Debugging and testing

## 🔌 Backend APIs

BetterCoin includes ready-to-use backend integration examples for Minecraft servers:

### Node.js/Express API

Located in `examples/backend/nodejs-express/`

```bash
cd examples/backend/nodejs-express
npm install
npm start
```

**Features**:
- Token balance checking
- Multiple address queries
- Minecraft-specific endpoints
- CORS support

### Java Spring Boot API

Located in `examples/backend/java-spring/`

```bash
cd examples/backend/java-spring
mvn spring-boot:run
```

**Features**:
- Web3j integration
- RESTful endpoints
- Player balance verification
- Spring Boot ecosystem compatibility

### Go API

Located in `examples/backend/go-api/`

```bash
cd examples/backend/go-api
go mod init bettercoin-backend
go get github.com/ethereum/go-ethereum
go get github.com/gorilla/mux
go run main.go
```

### API Endpoints

All backend implementations provide these endpoints:

- `GET /api/v1/health` - Health check
- `GET /api/v1/token/info` - Token information
- `GET /api/v1/balance/{address}` - Get token balance
- `GET /api/v1/balance/{address}/check/{amount}` - Check sufficient balance
- `POST /api/v1/balances` - Get multiple balances
- `GET /api/v1/minecraft/can-afford/{address}/{cost}` - Minecraft-specific

## 🔒 Security

### Smart Contract Security

- **OpenZeppelin**: Built on audited OpenZeppelin contracts
- **Access Control**: Owner-only functions protected with `onlyOwner` modifier
- **Input Validation**: All functions validate inputs and handle edge cases
- **Events**: Comprehensive event logging for transparency

### Best Practices

1. **Private Key Security**: Never share or commit private keys
2. **Network Verification**: Always verify contract addresses
3. **Testnet First**: Test thoroughly on testnet before mainnet
4. **Regular Updates**: Keep dependencies updated

### Audit Checklist

- ✅ OpenZeppelin imports for security
- ✅ Proper access control implementation  
- ✅ Input validation on all functions
- ✅ Event emission for transparency
- ✅ Comprehensive test coverage
- ✅ Gas optimization
- ✅ No known vulnerabilities

## 📊 Contract Interactions

### Owner Functions

```javascript
// Mint new tokens
await contract.mint("0x...", ethers.parseEther("1000"));

// Burn tokens from any address  
await contract.burn("0x...", ethers.parseEther("500"));

// Transfer ownership
await contract.transferOwnership("0x...");
```

### User Functions

```javascript
// Transfer tokens
await contract.transfer("0x...", ethers.parseEther("100"));

// Approve spending
await contract.approve("0x...", ethers.parseEther("50"));

// Burn own tokens
await contract.burnOwnTokens(ethers.parseEther("25"));
```

## 🎮 Minecraft Integration Examples

### Java Plugin Example

```java
// Check player balance before purchase
String playerWallet = getPlayerWallet(player);
double itemCost = 100.0;

HttpResponse<String> response = HttpClient.newHttpClient()
    .send(HttpRequest.newBuilder()
        .uri(URI.create("http://localhost:8080/api/v1/minecraft/can-afford/" + playerWallet + "/" + itemCost))
        .GET()
        .build(), HttpResponse.BodyHandlers.ofString());

JsonObject result = JsonParser.parseString(response.body()).getAsJsonObject();
if (result.get("canAfford").getAsBoolean()) {
    // Allow purchase
    player.sendMessage("Purchase successful!");
} else {
    // Deny purchase
    player.sendMessage("Insufficient MBC tokens!");
}
```

### Bukkit/Spigot Plugin

```java
@EventHandler
public void onPlayerJoin(PlayerJoinEvent event) {
    Player player = event.getPlayer();
    String wallet = getPlayerWallet(player);
    
    // Check player's MBC balance
    CompletableFuture.supplyAsync(() -> {
        return checkBalance(wallet);
    }).thenAccept(balance -> {
        player.sendMessage("Your MBC balance: " + balance);
    });
}
```

## 📁 Project Structure

```
BetterCoin/
├── contracts/                 # Solidity smart contracts
│   ├── BetterCoin.sol        # Main token contract
│   └── Lock.sol              # Example contract (generated)
├── scripts/                  # Deployment and utility scripts
│   ├── deploy.js             # Main deployment script
│   └── verify.js             # Contract verification script
├── test/                     # Test files
│   └── BetterCoin.js         # Comprehensive token tests
├── ignition/modules/         # Hardhat Ignition deployment
│   └── BetterCoin.js         # Ignition deployment module
├── docs/                     # Documentation
│   ├── metamask-guide.md     # MetaMask integration guide
│   └── remix-guide.md        # Remix IDE guide
├── examples/backend/         # Backend integration examples
│   ├── nodejs-express/       # Node.js API server
│   ├── java-spring/          # Java Spring Boot API
│   └── go-api/               # Go API server
├── deployments/              # Deployment artifacts (generated)
├── .env.example              # Environment variables template
├── hardhat.config.js         # Hardhat configuration
├── package.json              # Node.js dependencies
└── README.md                 # This file
```

## 🛣 Roadmap

### Phase 1: Core Token ✅
- [x] ERC-20 implementation
- [x] Mint/burn functionality  
- [x] Comprehensive testing
- [x] Deployment scripts

### Phase 2: Integration 🚧
- [x] MetaMask guide
- [x] Remix integration
- [x] Backend API examples
- [ ] Frontend dashboard
- [ ] Minecraft plugin templates

### Phase 3: Advanced Features 📋
- [ ] Governance mechanisms
- [ ] Staking/rewards system
- [ ] Cross-chain bridging
- [ ] DeFi integrations

## 🤝 Contributing

We welcome contributions to BetterCoin! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/your-username/BetterCoin.git
cd BetterCoin
npm install
npm run compile
npm run test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract implementations
- [Hardhat](https://hardhat.org/) for the excellent development environment
- [Ethers.js](https://docs.ethers.io/) for Ethereum interactions
- The Ethereum community for continuous innovation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/BetterCoin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/BetterCoin/discussions)
- **Documentation**: [Wiki](https://github.com/your-username/BetterCoin/wiki)

## 🔗 Links

- **Contract on Etherscan**: [View on Etherscan](https://etherscan.io/address/CONTRACT_ADDRESS)
- **Token Tracker**: [View Token Info](https://etherscan.io/token/CONTRACT_ADDRESS)
- **Sepolia Testnet**: [View on Sepolia](https://sepolia.etherscan.io/address/CONTRACT_ADDRESS)

---

<div align="center">
  <p>Built with ❤️ for the Minecraft and Blockchain communities</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
