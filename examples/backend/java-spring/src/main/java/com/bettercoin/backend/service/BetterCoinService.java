package com.bettercoin.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Numeric;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;

@Service
public class BetterCoinService {

    private static final Logger logger = LoggerFactory.getLogger(BetterCoinService.class);
    
    // ERC-20 function signatures
    private static final String BALANCE_OF_SIGNATURE = "0x70a08231";
    private static final String NAME_SIGNATURE = "0x06fdde03";
    private static final String SYMBOL_SIGNATURE = "0x95d89b41";
    private static final String DECIMALS_SIGNATURE = "0x313ce567";
    private static final String TOTAL_SUPPLY_SIGNATURE = "0x18160ddd";
    
    private final Web3j web3j;
    private final String contractAddress;
    
    // Token constants
    private static final int DECIMALS = 18;
    private static final BigInteger DECIMAL_FACTOR = BigInteger.valueOf(10).pow(DECIMALS);
    
    public BetterCoinService(@Value("${bettercoin.rpc.url}") String rpcUrl,
                           @Value("${bettercoin.contract.address}") String contractAddress) {
        this.web3j = Web3j.build(new HttpService(rpcUrl));
        this.contractAddress = contractAddress;
        logger.info("BetterCoin service initialized with contract: {}", contractAddress);
    }
    
    /**
     * Get token balance for a wallet address
     */
    public TokenBalance getBalance(String walletAddress) {
        try {
            // Prepare function call data
            String paddedAddress = padAddress(walletAddress);
            String callData = BALANCE_OF_SIGNATURE + paddedAddress;
            
            // Create transaction for the call
            Transaction transaction = Transaction.createEthCallTransaction(
                null, contractAddress, callData);
            
            // Execute the call
            EthCall ethCall = web3j.ethCall(transaction, DefaultBlockParameterName.LATEST).send();
            
            if (ethCall.hasError()) {
                throw new RuntimeException("Contract call failed: " + ethCall.getError().getMessage());
            }
            
            // Parse response
            String result = ethCall.getValue();
            BigInteger balanceWei = Numeric.toBigInt(result);
            
            // Convert to decimal representation
            BigDecimal balance = new BigDecimal(balanceWei)
                .divide(new BigDecimal(DECIMAL_FACTOR), 18, RoundingMode.DOWN);
            
            return new TokenBalance(walletAddress, balance.toString(), balanceWei.toString());
            
        } catch (Exception e) {
            logger.error("Error getting balance for address {}: {}", walletAddress, e.getMessage());
            throw new RuntimeException("Failed to get balance: " + e.getMessage());
        }
    }
    
    /**
     * Get token information
     */
    public TokenInfo getTokenInfo() {
        try {
            // For simplicity, return static info that matches our contract
            // In production, you'd make actual contract calls
            return new TokenInfo(
                "BetterCoin",
                "MBC", 
                DECIMALS,
                getTotalSupply(),
                contractAddress
            );
        } catch (Exception e) {
            logger.error("Error getting token info: {}", e.getMessage());
            throw new RuntimeException("Failed to get token info: " + e.getMessage());
        }
    }
    
    /**
     * Check if address has sufficient balance
     */
    public BalanceCheck hasBalance(String walletAddress, BigDecimal requiredAmount) {
        TokenBalance balance = getBalance(walletAddress);
        BigDecimal currentBalance = new BigDecimal(balance.getBalance());
        boolean hasEnough = currentBalance.compareTo(requiredAmount) >= 0;
        
        return new BalanceCheck(
            walletAddress,
            currentBalance.toString(),
            requiredAmount.toString(),
            hasEnough
        );
    }
    
    /**
     * Get total supply (simplified implementation)
     */
    private String getTotalSupply() {
        try {
            Transaction transaction = Transaction.createEthCallTransaction(
                null, contractAddress, TOTAL_SUPPLY_SIGNATURE);
            
            EthCall ethCall = web3j.ethCall(transaction, DefaultBlockParameterName.LATEST).send();
            
            if (ethCall.hasError()) {
                return "1000000"; // Fallback to initial supply
            }
            
            String result = ethCall.getValue();
            BigInteger totalSupplyWei = Numeric.toBigInt(result);
            BigDecimal totalSupply = new BigDecimal(totalSupplyWei)
                .divide(new BigDecimal(DECIMAL_FACTOR), 18, RoundingMode.DOWN);
                
            return totalSupply.toString();
            
        } catch (Exception e) {
            logger.warn("Could not get total supply, using fallback: {}", e.getMessage());
            return "1000000"; // Fallback to initial supply
        }
    }
    
    /**
     * Pad address to 32 bytes (64 hex characters)
     */
    private String padAddress(String address) {
        String cleanAddress = address.startsWith("0x") ? address.substring(2) : address;
        return String.format("%064s", cleanAddress).replace(' ', '0');
    }
    
    // Data classes
    public static class TokenBalance {
        private final String walletAddress;
        private final String balance;
        private final String balanceWei;
        
        public TokenBalance(String walletAddress, String balance, String balanceWei) {
            this.walletAddress = walletAddress;
            this.balance = balance;
            this.balanceWei = balanceWei;
        }
        
        // Getters
        public String getWalletAddress() { return walletAddress; }
        public String getBalance() { return balance; }
        public String getBalanceWei() { return balanceWei; }
    }
    
    public static class TokenInfo {
        private final String name;
        private final String symbol;
        private final int decimals;
        private final String totalSupply;
        private final String contractAddress;
        
        public TokenInfo(String name, String symbol, int decimals, String totalSupply, String contractAddress) {
            this.name = name;
            this.symbol = symbol;
            this.decimals = decimals;
            this.totalSupply = totalSupply;
            this.contractAddress = contractAddress;
        }
        
        // Getters
        public String getName() { return name; }
        public String getSymbol() { return symbol; }
        public int getDecimals() { return decimals; }
        public String getTotalSupply() { return totalSupply; }
        public String getContractAddress() { return contractAddress; }
    }
    
    public static class BalanceCheck {
        private final String walletAddress;
        private final String currentBalance;
        private final String requiredAmount;
        private final boolean hasEnoughBalance;
        
        public BalanceCheck(String walletAddress, String currentBalance, String requiredAmount, boolean hasEnoughBalance) {
            this.walletAddress = walletAddress;
            this.currentBalance = currentBalance;
            this.requiredAmount = requiredAmount;
            this.hasEnoughBalance = hasEnoughBalance;
        }
        
        // Getters
        public String getWalletAddress() { return walletAddress; }
        public String getCurrentBalance() { return currentBalance; }
        public String getRequiredAmount() { return requiredAmount; }
        public boolean isHasEnoughBalance() { return hasEnoughBalance; }
    }
}