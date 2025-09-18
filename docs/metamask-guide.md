# MetaMask Integration Guide

This guide explains how to interact with the BetterCoin (MBC) token using MetaMask.

## Prerequisites

1. **MetaMask Extension**: Install MetaMask browser extension from [metamask.io](https://metamask.io/)
2. **Wallet Setup**: Create or import a wallet in MetaMask
3. **Network Configuration**: Configure the network where BetterCoin is deployed

## Network Configuration

### For Sepolia Testnet:

1. Open MetaMask
2. Click on the network dropdown (usually shows "Ethereum Mainnet")
3. Select "Add Network" or "Custom RPC"
4. Enter the following details:
   - **Network Name**: Sepolia Test Network
   - **RPC URL**: https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   - **Chain ID**: 11155111
   - **Currency Symbol**: ETH
   - **Block Explorer URL**: https://sepolia.etherscan.io

### For Local Hardhat Network:

1. Start local Hardhat node: `npm run node`
2. Add custom network in MetaMask:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH

## Adding BetterCoin Token to MetaMask

1. **Get Contract Address**: After deployment, copy the BetterCoin contract address
2. **Import Token**:
   - Open MetaMask
   - Click "Import tokens" at the bottom of the assets list
   - Select "Custom token"
   - Paste the BetterCoin contract address
   - Token symbol (MBC) and decimals (18) should auto-populate
   - Click "Add Custom Token"

## Token Interaction

### Viewing Balance
- Once added, your BetterCoin balance will appear in MetaMask assets list
- Balance updates automatically when transactions occur

### Sending BetterCoin Tokens
1. Click on BetterCoin (MBC) in your assets list
2. Click "Send"
3. Enter recipient address
4. Enter amount to send
5. Review gas fees and confirm transaction

### Receiving BetterCoin Tokens
- Share your wallet address with the sender
- Tokens will appear in your MetaMask once the transaction is confirmed

## Contract Interaction (Advanced)

### Using MetaMask with DApps
- Connect MetaMask to decentralized applications
- Approve token spending when prompted
- Sign transactions for contract interactions

### Manual Contract Calls
You can interact with BetterCoin functions directly:

1. **Check Token Info**: View token details like name, symbol, total supply
2. **Transfer Tokens**: Send tokens to other addresses
3. **Approve Spending**: Allow other contracts to spend your tokens

## Troubleshooting

### Common Issues:

1. **Transaction Stuck**: Increase gas price or use "Speed Up" option
2. **Token Not Visible**: Ensure correct contract address and network
3. **Insufficient Gas**: Keep some ETH for transaction fees
4. **Wrong Network**: Switch to the network where BetterCoin is deployed

### Getting Test ETH (Sepolia):
- Use Sepolia faucets to get test ETH for gas fees
- Popular faucets: [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

## Security Notes

⚠️ **Important Security Tips**:
- Never share your private key or seed phrase
- Always verify contract addresses before interacting
- Double-check transaction details before confirming
- Use hardware wallets for large amounts
- Be cautious of phishing sites

## Example Transaction Flow

1. **Deploy Contract**: Use deployment script to deploy BetterCoin
2. **Add to MetaMask**: Import token using contract address
3. **Mint Tokens**: Owner can mint new tokens (if you're the owner)
4. **Transfer Tokens**: Send tokens to other addresses
5. **View on Explorer**: Check transactions on Etherscan

## Next Steps

- Explore DeFi protocols that accept ERC-20 tokens
- Consider building custom applications that interact with BetterCoin
- Look into token governance features
- Integrate with Minecraft servers using backend APIs