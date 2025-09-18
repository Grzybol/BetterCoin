# Remix IDE Integration Guide

This guide explains how to interact with the BetterCoin (MBC) token using Remix IDE.

## What is Remix IDE?

Remix is a web-based IDE for developing, deploying, and interacting with Ethereum smart contracts. It's perfect for quick testing and contract interaction without setting up a local development environment.

## Getting Started

### 1. Access Remix IDE

Visit [remix.ethereum.org](https://remix.ethereum.org) in your web browser.

### 2. Import BetterCoin Contract

#### Option A: Upload Files
1. Click on the "File Explorer" tab
2. Create a new folder called "BetterCoin"
3. Upload the BetterCoin.sol contract file
4. Upload OpenZeppelin imports (or use Remix's built-in imports)

#### Option B: Create from Scratch
1. Create a new file: `BetterCoin.sol`
2. Copy and paste the BetterCoin contract code
3. Remix will automatically resolve OpenZeppelin imports

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BetterCoin is ERC20, Ownable {
    // Contract code here
}
```

## Compiling the Contract

1. **Select Compiler Version**:
   - Go to "Solidity Compiler" tab
   - Choose compiler version 0.8.19 or compatible
   - Enable optimization if desired

2. **Compile**:
   - Click "Compile BetterCoin.sol"
   - Check for compilation errors
   - Green checkmark indicates successful compilation

## Deploying the Contract

### 1. Configure Environment

**For Testnet Deployment (Sepolia)**:
1. Go to "Deploy & Run Transactions" tab
2. Select "Injected Provider - MetaMask" as environment
3. Ensure MetaMask is connected to Sepolia network
4. Ensure you have test ETH for gas fees

**For Local Testing**:
1. Select "Remix VM (London)" for quick testing
2. Use provided test accounts

### 2. Deploy Contract

1. **Select Contract**: Choose "BetterCoin" from the dropdown
2. **Constructor Parameters**: None required (BetterCoin has no constructor parameters)
3. **Deploy**: Click "Deploy" button
4. **Confirm Transaction**: Approve in MetaMask if using testnet

### 3. Verify Deployment

- Contract address appears under "Deployed Contracts"
- Expand to see all contract functions
- Initial supply (1,000,000 MBC) should be minted to deployer

## Interacting with the Contract

### View Functions (Free - No Gas Required)

1. **name()**: Returns "BetterCoin"
2. **symbol()**: Returns "MBC"
3. **decimals()**: Returns 18
4. **totalSupply()**: Returns total token supply
5. **balanceOf(address)**: Check balance of any address
6. **owner()**: Returns contract owner address
7. **getTokenInfo()**: Returns comprehensive token information

### Write Functions (Requires Gas)

#### Owner-Only Functions
1. **mint(address, amount)**:
   - Only owner can mint new tokens
   - Input recipient address and amount (in wei)
   - Example: mint 1000 tokens = 1000000000000000000000

2. **burn(address, amount)**:
   - Only owner can burn tokens from any address
   - Input address and amount to burn

3. **transferOwnership(address)**:
   - Transfer contract ownership to another address

#### Public Functions
1. **transfer(address, amount)**:
   - Send tokens to another address
   - Input recipient and amount

2. **approve(address, amount)**:
   - Approve another address to spend your tokens
   - Used for DeFi integrations

3. **transferFrom(from, to, amount)**:
   - Transfer tokens on behalf of another user (requires approval)

4. **burnOwnTokens(amount)**:
   - Burn tokens from your own balance

## Example Interactions

### 1. Minting Tokens (Owner Only)

```
Function: mint
Parameters:
- to: 0x742d35cc6647c7f06c3a0532a8b4c3c4f8b8c8d8
- amount: 1000000000000000000000 (1000 tokens)
```

### 2. Checking Balance

```
Function: balanceOf
Parameters:
- account: 0x742d35cc6647c7f06c3a0532a8b4c3c4f8b8c8d8
```

### 3. Transferring Tokens

```
Function: transfer
Parameters:
- to: 0x123...789
- amount: 500000000000000000000 (500 tokens)
```

## Working with Events

Remix automatically detects and displays emitted events:

1. **TokensMinted**: Shows when tokens are minted
2. **TokensBurned**: Shows when tokens are burned
3. **Transfer**: Standard ERC-20 transfer events
4. **Approval**: Token approval events

## Debugging and Testing

### 1. Debug Transactions

- Click on transaction hash in Remix
- Use built-in debugger to step through execution
- Inspect state changes and gas usage

### 2. Test Different Scenarios

```javascript
// Test script examples for Remix
// Create multiple accounts to test transfers
// Test edge cases like insufficient balance
// Verify owner-only functions revert for non-owners
```

### 3. Gas Estimation

- Remix shows gas estimates for each function call
- Compare gas costs between different operations
- Optimize for production deployment

## Advanced Features

### 1. Contract Verification

After deploying to testnet:
1. Copy contract address from Remix
2. Go to Etherscan
3. Use "Verify and Publish" feature
4. Upload source code and constructor parameters

### 2. Integration with MetaMask

1. Deploy contract in Remix with MetaMask
2. Copy contract address
3. Add token to MetaMask using the address
4. Interact with token directly in MetaMask

### 3. Creating Custom Scripts

Remix supports JavaScript for advanced interactions:

```javascript
// Example script to interact with BetterCoin
const contractAddress = "0x..."; // Your deployed contract address
const contract = new web3.eth.Contract(abi, contractAddress);

// Get token info
contract.methods.getTokenInfo().call()
  .then(result => console.log(result));
```

## Best Practices

1. **Test Thoroughly**: Use Remix VM for initial testing
2. **Start Small**: Test with small amounts on testnet
3. **Verify Functions**: Double-check function parameters
4. **Monitor Events**: Watch for emitted events to confirm operations
5. **Save Work**: Export important transactions and addresses

## Troubleshooting

### Common Issues:

1. **Compilation Errors**: Check Solidity version and import paths
2. **Deployment Failures**: Ensure sufficient gas and ETH balance
3. **Function Reverts**: Check function requirements and permissions
4. **MetaMask Connection**: Refresh page and reconnect wallet

### Error Messages:

- "Ownable: caller is not the owner": Only owner can call this function
- "ERC20: transfer amount exceeds balance": Insufficient token balance
- "BetterCoin: amount must be greater than 0": Invalid amount parameter

## Integration with Minecraft Backend

Once deployed and tested in Remix, you can:

1. Copy the deployed contract address
2. Use it in backend applications (Java/Node.js)
3. Monitor token balances for Minecraft players
4. Implement token rewards and economies

## Next Steps

- Deploy to mainnet for production use
- Integrate with DeFi protocols
- Build custom frontend applications
- Create token governance mechanisms
- Implement cross-chain bridging