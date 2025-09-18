# BetterCoin (MBC)

BetterCoin is an ERC-20 compatible token designed for the BetterCoin Minecraft ecosystem. It is built with Hardhat and OpenZeppelin and ships with deployment scripts, verification helpers, unit tests, and integration guidelines.

## Features

- ✅ ERC-20 compliant token with symbol **MBC**
- ✅ Initial supply of 1,000,000 MBC minted to the deployer (owner)
- ✅ Owner-gated mint and burn administration functions
- ✅ Hardhat scripts for local and Sepolia deployment plus Etherscan verification
- ✅ Unit tests implemented with Hardhat, Ethers, and Chai
- ✅ Documentation for MetaMask, Remix, and backend integration

## Project Structure

```
├── contracts
│   └── BetterCoin.sol           # ERC-20 token implementation
├── docs
│   └── USER_GUIDE.md            # Wallet and Remix walkthroughs
├── examples
│   └── node-backend.js          # Sample Express balance endpoint
├── scripts
│   ├── deploy.js                # Deployment helper
│   └── verify.js                # Etherscan verification helper
├── test
│   └── BetterCoin.js            # Hardhat/Chai unit tests
├── hardhat.config.js            # Hardhat configuration
├── package.json
├── .env.example
└── README.md
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Copy environment template**
   ```bash
   cp .env.example .env
   ```
   Populate the `.env` file with your RPC URL, deployer private key, and optional Etherscan API key.

### Useful Scripts

| Command | Description |
| ------- | ----------- |
| `npx hardhat compile` | Compile the Solidity contracts. |
| `npx hardhat test` | Run the unit test suite. |
| `npx hardhat run scripts/deploy.js --network localhost` | Deploy to a local Hardhat node. |
| `npx hardhat run scripts/deploy.js --network sepolia` | Deploy to the Sepolia testnet (requires funded deployer account). |
| `npx hardhat run scripts/verify.js --network sepolia --address <tokenAddress> --owner <ownerAddress>` | Submit verification on Etherscan. |
| `REPORT_GAS=true npx hardhat test` | Run tests with gas usage reporting. |

## Deployment Workflow

1. Start a local Hardhat node (optional):
   ```bash
   npx hardhat node
   ```
2. Deploy to the selected network using the `scripts/deploy.js` helper.
3. Save the printed contract address for subsequent interactions and verification.
4. (Optional) Verify the contract once deployed on Sepolia:
   ```bash
   npx hardhat run scripts/verify.js --network sepolia --address 0xYourToken --owner 0xDeployer
   ```

## Testing

Run the full test suite with:
```bash
npx hardhat test
```

The tests assert:
- Initial supply is minted to the deployer.
- Only the owner can mint or burn tokens.
- Mint and burn events emit the correct transfer logs.

## MetaMask & Remix Instructions

Detailed wallet setup and Remix interaction instructions are available in [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md).

## Backend Integration Example

A lightweight Node.js/Express endpoint demonstrating how to check a player's token balance is provided in [`examples/node-backend.js`](examples/node-backend.js). Update the RPC URL, contract address, and ABI path as needed for your environment.

## License

This project is released under the MIT License.
