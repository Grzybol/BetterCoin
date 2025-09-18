const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
require('dotenv').config();

// BetterCoin ABI (minimal for balance checking)
const BETTERCOIN_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function owner() view returns (address)",
  "function getTokenInfo() view returns (string, string, uint8, uint256, address)"
];

class BetterCoinService {
  constructor(rpcUrl, contractAddress) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contract = new ethers.Contract(contractAddress, BETTERCOIN_ABI, this.provider);
    this.contractAddress = contractAddress;
  }

  // Get token balance for a specific address
  async getBalance(walletAddress) {
    try {
      const balance = await this.contract.balanceOf(walletAddress);
      const balanceFormatted = ethers.formatEther(balance);
      
      return {
        walletAddress: walletAddress,
        balance: balanceFormatted,
        balanceWei: balance.toString()
      };
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  // Get comprehensive token information
  async getTokenInfo() {
    try {
      const [name, symbol, decimals, totalSupply, owner] = await this.contract.getTokenInfo();
      
      return {
        name: name,
        symbol: symbol,
        decimals: decimals,
        totalSupply: ethers.formatEther(totalSupply),
        totalSupplyWei: totalSupply.toString(),
        owner: owner,
        contractAddress: this.contractAddress
      };
    } catch (error) {
      // Fallback to individual calls if getTokenInfo fails
      try {
        const name = await this.contract.name();
        const symbol = await this.contract.symbol();
        const decimals = await this.contract.decimals();
        const totalSupply = await this.contract.totalSupply();
        const owner = await this.contract.owner();

        return {
          name: name,
          symbol: symbol,
          decimals: decimals,
          totalSupply: ethers.formatEther(totalSupply),
          totalSupplyWei: totalSupply.toString(),
          owner: owner,
          contractAddress: this.contractAddress
        };
      } catch (fallbackError) {
        throw new Error(`Failed to get token info: ${fallbackError.message}`);
      }
    }
  }

  // Check if an address has sufficient balance
  async hasBalance(walletAddress, requiredAmount) {
    try {
      const balance = await this.contract.balanceOf(walletAddress);
      const requiredWei = ethers.parseEther(requiredAmount.toString());
      
      return {
        walletAddress: walletAddress,
        currentBalance: ethers.formatEther(balance),
        requiredAmount: requiredAmount.toString(),
        hasEnoughBalance: balance >= requiredWei
      };
    } catch (error) {
      throw new Error(`Failed to check balance: ${error.message}`);
    }
  }

  // Get multiple balances at once
  async getMultipleBalances(addresses) {
    try {
      const balances = await Promise.all(
        addresses.map(async (address) => {
          const balance = await this.contract.balanceOf(address);
          return {
            walletAddress: address,
            balance: ethers.formatEther(balance),
            balanceWei: balance.toString()
          };
        })
      );
      
      return balances;
    } catch (error) {
      throw new Error(`Failed to get multiple balances: ${error.message}`);
    }
  }
}

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PORT = process.env.PORT || 3000;

if (!CONTRACT_ADDRESS) {
  console.error('CONTRACT_ADDRESS environment variable is required');
  process.exit(1);
}

// Initialize service
const betterCoinService = new BetterCoinService(RPC_URL, CONTRACT_ADDRESS);

// Middleware for error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'BetterCoin Backend API',
    contract: CONTRACT_ADDRESS,
    rpcUrl: RPC_URL
  });
});

// Get token information
app.get('/api/v1/token/info', asyncHandler(async (req, res) => {
  const tokenInfo = await betterCoinService.getTokenInfo();
  res.json(tokenInfo);
}));

// Get balance for a single address
app.get('/api/v1/balance/:address', asyncHandler(async (req, res) => {
  const { address } = req.params;
  
  if (!ethers.isAddress(address)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }
  
  const balance = await betterCoinService.getBalance(address);
  res.json(balance);
}));

// Check if address has sufficient balance
app.get('/api/v1/balance/:address/check/:amount', asyncHandler(async (req, res) => {
  const { address, amount } = req.params;
  
  if (!ethers.isAddress(address)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }
  
  if (isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  
  const result = await betterCoinService.hasBalance(address, amount);
  res.json(result);
}));

// Get balances for multiple addresses
app.post('/api/v1/balances', asyncHandler(async (req, res) => {
  const { addresses } = req.body;
  
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return res.status(400).json({ error: 'Addresses array is required' });
  }
  
  if (addresses.length > 50) {
    return res.status(400).json({ error: 'Maximum 50 addresses allowed' });
  }
  
  // Validate all addresses
  for (const address of addresses) {
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: `Invalid address: ${address}` });
    }
  }
  
  const balances = await betterCoinService.getMultipleBalances(addresses);
  res.json({
    addresses: addresses,
    balances: balances,
    totalAddresses: addresses.length
  });
}));

// Minecraft-specific endpoints

// Check if player can afford a purchase
app.get('/api/v1/minecraft/can-afford/:address/:cost', asyncHandler(async (req, res) => {
  const { address, cost } = req.params;
  
  if (!ethers.isAddress(address)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }
  
  const result = await betterCoinService.hasBalance(address, cost);
  
  res.json({
    playerId: address,
    itemCost: cost,
    canAfford: result.hasEnoughBalance,
    currentBalance: result.currentBalance,
    shortfall: result.hasEnoughBalance ? '0' : (parseFloat(cost) - parseFloat(result.currentBalance)).toString()
  });
}));

// Get leaderboard (top balances) - Note: This would require indexing in production
app.get('/api/v1/minecraft/leaderboard', asyncHandler(async (req, res) => {
  // This is a simplified example - in production you'd need to maintain
  // a database of player addresses or use event indexing
  res.json({
    message: 'Leaderboard would require event indexing or address registry',
    suggestion: 'Implement event listeners to track Transfer events and maintain a player database'
  });
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/v1/health',
      'GET /api/v1/token/info',
      'GET /api/v1/balance/:address',
      'GET /api/v1/balance/:address/check/:amount',
      'POST /api/v1/balances',
      'GET /api/v1/minecraft/can-afford/:address/:cost'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BetterCoin Backend API running on port ${PORT}`);
  console.log(`📄 Contract Address: ${CONTRACT_ADDRESS}`);
  console.log(`🔗 RPC URL: ${RPC_URL}`);
  console.log(`\n📚 Available endpoints:`);
  console.log(`   GET  /api/v1/health`);
  console.log(`   GET  /api/v1/token/info`);
  console.log(`   GET  /api/v1/balance/:address`);
  console.log(`   GET  /api/v1/balance/:address/check/:amount`);
  console.log(`   POST /api/v1/balances`);
  console.log(`   GET  /api/v1/minecraft/can-afford/:address/:cost`);
});

// Export for testing
module.exports = { app, BetterCoinService };

/*
Example Usage:

1. Install dependencies:
   npm install express ethers cors dotenv

2. Create .env file:
   CONTRACT_ADDRESS=0x123...abc
   RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   PORT=3000

3. Run the service:
   node server.js

4. Test endpoints:
   curl http://localhost:3000/api/v1/health
   curl http://localhost:3000/api/v1/token/info
   curl http://localhost:3000/api/v1/balance/0x742d35cc6647c7f06c3a0532a8b4c3c4f8b8c8d8
   curl http://localhost:3000/api/v1/balance/0x742d35cc.../check/100
   curl -X POST http://localhost:3000/api/v1/balances \
     -H "Content-Type: application/json" \
     -d '{"addresses": ["0x123...", "0x456..."]}'

5. Minecraft Server Integration Example:
   
   // In your Minecraft plugin/mod:
   const playerWallet = "0x742d35cc6647c7f06c3a0532a8b4c3c4f8b8c8d8";
   const itemCost = "100";
   
   fetch(`http://localhost:3000/api/v1/minecraft/can-afford/${playerWallet}/${itemCost}`)
     .then(response => response.json())
     .then(data => {
       if (data.canAfford) {
         // Allow purchase
         console.log(`Player can afford item (Balance: ${data.currentBalance} MBC)`);
       } else {
         // Deny purchase
         console.log(`Insufficient funds. Need ${data.shortfall} more MBC`);
       }
     });
*/