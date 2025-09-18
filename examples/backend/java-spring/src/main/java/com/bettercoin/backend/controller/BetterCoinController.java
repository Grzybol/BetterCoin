package com.bettercoin.backend.controller;

import com.bettercoin.backend.service.BetterCoinService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class BetterCoinController {

    private static final Logger logger = LoggerFactory.getLogger(BetterCoinController.class);

    @Autowired
    private BetterCoinService betterCoinService;

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "BetterCoin Backend API");
        return ResponseEntity.ok(response);
    }

    /**
     * Get token information
     */
    @GetMapping("/token/info")
    public ResponseEntity<BetterCoinService.TokenInfo> getTokenInfo() {
        try {
            BetterCoinService.TokenInfo tokenInfo = betterCoinService.getTokenInfo();
            return ResponseEntity.ok(tokenInfo);
        } catch (Exception e) {
            logger.error("Error getting token info: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get balance for a wallet address
     */
    @GetMapping("/balance/{address}")
    public ResponseEntity<BetterCoinService.TokenBalance> getBalance(@PathVariable String address) {
        try {
            if (!isValidAddress(address)) {
                return ResponseEntity.badRequest().build();
            }
            
            BetterCoinService.TokenBalance balance = betterCoinService.getBalance(address);
            return ResponseEntity.ok(balance);
        } catch (Exception e) {
            logger.error("Error getting balance for {}: {}", address, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Check if address has sufficient balance
     */
    @GetMapping("/balance/{address}/check/{amount}")
    public ResponseEntity<BetterCoinService.BalanceCheck> checkBalance(
            @PathVariable String address,
            @PathVariable String amount) {
        try {
            if (!isValidAddress(address)) {
                return ResponseEntity.badRequest().build();
            }
            
            BigDecimal requiredAmount = new BigDecimal(amount);
            if (requiredAmount.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().build();
            }
            
            BetterCoinService.BalanceCheck balanceCheck = betterCoinService.hasBalance(address, requiredAmount);
            return ResponseEntity.ok(balanceCheck);
        } catch (NumberFormatException e) {
            logger.error("Invalid amount format: {}", amount);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error checking balance for {}: {}", address, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Minecraft-specific endpoint: Check if player can afford a purchase
     */
    @GetMapping("/minecraft/can-afford/{address}/{cost}")
    public ResponseEntity<Map<String, Object>> canAfford(
            @PathVariable String address,
            @PathVariable String cost) {
        try {
            if (!isValidAddress(address)) {
                return ResponseEntity.badRequest().build();
            }
            
            BigDecimal itemCost = new BigDecimal(cost);
            if (itemCost.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().build();
            }
            
            BetterCoinService.BalanceCheck balanceCheck = betterCoinService.hasBalance(address, itemCost);
            
            Map<String, Object> response = new HashMap<>();
            response.put("playerId", address);
            response.put("itemCost", cost);
            response.put("canAfford", balanceCheck.isHasEnoughBalance());
            response.put("currentBalance", balanceCheck.getCurrentBalance());
            
            if (!balanceCheck.isHasEnoughBalance()) {
                BigDecimal shortfall = itemCost.subtract(new BigDecimal(balanceCheck.getCurrentBalance()));
                response.put("shortfall", shortfall.toString());
            } else {
                response.put("shortfall", "0");
            }
            
            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            logger.error("Invalid cost format: {}", cost);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error checking if player can afford item: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Minecraft leaderboard endpoint (placeholder)
     */
    @GetMapping("/minecraft/leaderboard")
    public ResponseEntity<Map<String, String>> getLeaderboard() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Leaderboard would require event indexing or address registry");
        response.put("suggestion", "Implement event listeners to track Transfer events and maintain a player database");
        return ResponseEntity.ok(response);
    }

    /**
     * Simple address validation
     */
    private boolean isValidAddress(String address) {
        return address != null && 
               address.matches("^0x[a-fA-F0-9]{40}$");
    }

    /**
     * Error handler
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        logger.error("Unhandled exception: {}", e.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("error", "Internal server error");
        error.put("message", e.getMessage());
        return ResponseEntity.internalServerError().body(error);
    }
}

/*
Example Usage:

1. Start the Spring Boot application
2. Test endpoints:

   GET /api/v1/health
   GET /api/v1/token/info
   GET /api/v1/balance/0x742d35cc6647c7f06c3a0532a8b4c3c4f8b8c8d8
   GET /api/v1/balance/0x742d35cc.../check/100.5
   GET /api/v1/minecraft/can-afford/0x742d35cc.../250.0

3. Minecraft Server Integration:
   - Make HTTP requests from your Minecraft plugin/mod
   - Check player balances before allowing purchases
   - Integrate with in-game economies
   - Reward players based on blockchain interactions
*/