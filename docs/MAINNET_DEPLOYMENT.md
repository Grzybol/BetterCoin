# BetterCoin Mainnet Deployment Guide

> ⚠️ **Mainnet deployments are irreversible and costly.** Always rehearse these steps on a test network (Sepolia) and double-check every configuration value before broadcasting transactions to Ethereum mainnet.

## Prerequisites

1. **Audited contract & tests** – Ensure your latest contract changes are reviewed and that `npx hardhat test` passes locally.
2. **Environment variables** – Populate the following keys in your `.env` file:
   ```env
   MAINNET_RPC_URL=https://mainnet.infura.io/v3/<projectId>
   PRIVATE_KEY=0x<deployerPrivateKey>
   ETHERSCAN_API_KEY=<etherscanApiKey>
   ```
   - `PRIVATE_KEY` should correspond to the wallet that will own the initial supply. Prefer a hardware wallet or a fresh hot wallet with minimal funds.
   - Never commit `.env` to version control.
3. **Fund the deployer** – Send enough ETH to the deployer wallet to cover deployment gas (check current gas prices on [https://etherscan.io/gastracker](https://etherscan.io/gastracker)). The BetterCoin deployment typically costs ~0.03–0.05 ETH but fluctuates with network congestion.
4. **Install dependencies** – Run `npm install` to ensure the Hardhat toolbox and OpenZeppelin packages are available.

## Deployment Steps

1. **Compile the contracts** (recommended):
   ```bash
   npx hardhat compile
   ```
2. **Broadcast the deployment**:
   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```
   The script will print:
   - The deployer address.
   - The deployer's ETH balance.
   - The deployed BetterCoin contract address.
3. **Record deployment details** – Store the contract address, deployment transaction hash, and owner wallet in a secure document for future audits.
4. **Verify on Etherscan** (optional but recommended):
   ```bash
   npx hardhat run scripts/verify.js \
     --network mainnet \
     --address 0xYourBetterCoinAddress \
     --owner 0xOwnerAddress
   ```
   Successful verification allows anyone to read the source code on [https://etherscan.io](https://etherscan.io).

## Post-Deployment Checklist

- **Token metadata** – Add the contract address to MetaMask or other wallets to confirm the initial 1,000,000 MBC balance.
- **Secure the owner wallet** – Move excess ETH to cold storage and enable multisig controls if possible.
- **Monitor the contract** – Track the contract on analytics dashboards (Etherscan, Dune, etc.) for anomalous activity.
- **Plan mint/burn operations** – Use the owner wallet with caution. Consider implementing a multisig guard or time delay for administrative calls.

## Incident Response Tips

- Keep a pre-funded emergency wallet with the ability to interact with the contract (e.g., to pause integrations or burn compromised balances if your governance process allows).
- Document operational procedures for minting/burning, including required approvals and record-keeping standards.
- Subscribe to alerting services (Etherscan, Tenderly) for transactions targeting the BetterCoin contract.

Following this checklist should make your transition from testnet rehearsal to a safe mainnet launch smoother while minimizing the risk of operational mistakes.
