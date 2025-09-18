# BetterCoin Wallet & Remix Guide

This guide walks you through interacting with the BetterCoin (MBC) token using MetaMask and Remix. Substitute the placeholder addresses with your deployed contract details.

## MetaMask

### 1. Configure Network

**Local Hardhat**
1. Open MetaMask and click the network selector.
2. Choose "Add network manually".
3. Enter the following values:
   - **Network Name:** Hardhat Localhost
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
4. Save the configuration and switch to the new network.

**Sepolia Testnet**
- Sepolia is preconfigured in recent MetaMask builds. If it is not visible, go to *Settings → Advanced* and enable "Show test networks", then select **Sepolia**.

### 2. Import the Deployer Account (Optional)

To use the same account that deployed the contract:
1. Click the account icon → *Import Account*.
2. Paste the private key that you used in the `.env` file.
3. Confirm. **Never import real mainnet keys in a testing environment.**

### 3. Add the BetterCoin Token

1. Navigate to the *Tokens* tab and click **Import tokens**.
2. Paste your contract address (e.g. `0xYourTokenAddress`).
3. MetaMask will auto-fill the token symbol (`MBC`) and decimals (`18`).
4. Click **Add custom token** → **Import tokens**.

You can now see balances, send tokens, and request transfers directly within MetaMask.

### 4. Mint & Burn (Admin Only)

Use Hardhat scripts or Remix to invoke the `mint` and `burn` functions. Only the owner address can execute them. After each transaction, MetaMask will reflect the updated balances.

## Remix

Remix is useful for ad-hoc contract interactions without writing scripts.

1. Open [https://remix.ethereum.org](https://remix.ethereum.org).
2. In the *File Explorer*, create a new workspace or folder.
3. Add two files:
   - `BetterCoin.sol` – copy the contents from [`contracts/BetterCoin.sol`](../contracts/BetterCoin.sol).
   - `IERC20.sol` – optional if Remix cannot automatically fetch the OpenZeppelin dependency. Alternatively, enable the Remix *"Solidity compiler" → "Enable optimization"* and configure Remix to use the latest compiler with *"Solidity compiler" → "Compiler configuration" → "Enable Hardhat compilation"*.
4. Navigate to the *Solidity Compiler* tab and compile `BetterCoin.sol` with version `0.8.20`.
5. Go to the *Deploy & Run Transactions* tab:
   - **Environment:** Select *Injected Provider - MetaMask* (connects Remix to MetaMask).
   - **Account:** Choose your deployer/admin wallet.
   - **Contract:** Choose `BetterCoin`.
   - **Constructor arguments:** Paste the owner address (typically the MetaMask account).
6. Click **Deploy** and confirm the transaction in MetaMask. Remix will display the deployed contract under *Deployed Contracts*.
7. Expand the contract to call functions:
   - `mint(address,uint256)`: Provide a recipient and amount in wei (e.g. `1000000000000000000` for 1 MBC).
   - `burn(address,uint256)`: Provide the address and amount to burn (requires prior allowance or balance at the owner).
   - `balanceOf(address)`: Read wallet balances.

For existing deployments, paste the deployed address in the *At Address* field and click **At Address** to attach Remix to the live contract instance.

## Troubleshooting

- **"execution reverted" during mint/burn:** Ensure your connected MetaMask account matches the contract owner specified at deployment.
- **Incorrect token symbol/decimals:** Remove and re-import the token with the correct address.
- **Gas estimation errors:** Confirm the RPC URL is healthy and that the account has sufficient ETH for gas (on Sepolia, use a faucet).
