/**
 * Sample Express endpoint that returns the BetterCoin balance for a wallet.
 *
 * Usage:
 *   1. npm install express ethers dotenv cors
 *   2. node node-backend.js
 */
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());

const RPC_URL = process.env.SEPOLIA_RPC_URL || "http://127.0.0.1:8545";
const TOKEN_ADDRESS = process.env.CONTRACT_ADDRESS || "0xYourTokenAddress";
const ABI_PATH = process.env.TOKEN_ABI_PATH || path.join(__dirname, "../artifacts/contracts/BetterCoin.sol/BetterCoin.json");

if (!fs.existsSync(ABI_PATH)) {
  console.warn(`ABI file not found at ${ABI_PATH}. Compile the contract first or adjust TOKEN_ABI_PATH.`);
}

const abi = fs.existsSync(ABI_PATH)
  ? JSON.parse(fs.readFileSync(ABI_PATH)).abi
  : [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",
    ];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const token = new ethers.Contract(TOKEN_ADDRESS, abi, provider);

app.get("/balance/:wallet", async (req, res) => {
  try {
    const wallet = req.params.wallet;
    if (!ethers.isAddress(wallet)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    const [rawBalance, decimals, symbol] = await Promise.all([
      token.balanceOf(wallet),
      token.decimals(),
      token.symbol(),
    ]);

    const formatted = ethers.formatUnits(rawBalance, decimals);
    res.json({ wallet, balance: formatted, symbol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BetterCoin balance API listening on port ${PORT}`);
});
