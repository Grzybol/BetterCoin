package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"os"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/gorilla/mux"
)

// BetterCoinService handles blockchain interactions
type BetterCoinService struct {
	client          *ethclient.Client
	contractAddress common.Address
}

// TokenBalance represents a wallet's token balance
type TokenBalance struct {
	WalletAddress string `json:"walletAddress"`
	Balance       string `json:"balance"`
	BalanceWei    string `json:"balanceWei"`
}

// TokenInfo represents basic token information
type TokenInfo struct {
	Name        string `json:"name"`
	Symbol      string `json:"symbol"`
	Decimals    uint8  `json:"decimals"`
	TotalSupply string `json:"totalSupply"`
	Owner       string `json:"owner"`
}

// NewBetterCoinService creates a new service instance
func NewBetterCoinService(rpcURL, contractAddr string) (*BetterCoinService, error) {
	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to Ethereum client: %v", err)
	}

	return &BetterCoinService{
		client:          client,
		contractAddress: common.HexToAddress(contractAddr),
	}, nil
}

// GetBalance retrieves the BetterCoin balance for a wallet address
func (s *BetterCoinService) GetBalance(walletAddress string) (*TokenBalance, error) {
	// ERC-20 balanceOf function selector
	balanceOfSelector := "0x70a08231"
	address := common.HexToAddress(walletAddress)
	
	// Prepare the call data
	callData := balanceOfSelector + "000000000000000000000000" + address.Hex()[2:]
	
	// Make the call
	msg := ethereum.CallMsg{
		To:   &s.contractAddress,
		Data: common.Hex2Bytes(callData[2:]),
	}
	
	result, err := s.client.CallContract(context.Background(), msg, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to call contract: %v", err)
	}
	
	// Convert result to big.Int
	balance := new(big.Int).SetBytes(result)
	
	// Convert to decimal representation (18 decimals)
	divisor := new(big.Int).Exp(big.NewInt(10), big.NewInt(18), nil)
	balanceDecimal := new(big.Float).Quo(new(big.Float).SetInt(balance), new(big.Float).SetInt(divisor))
	
	return &TokenBalance{
		WalletAddress: walletAddress,
		Balance:       balanceDecimal.String(),
		BalanceWei:    balance.String(),
	}, nil
}

// HTTP Handlers

func (s *BetterCoinService) handleGetBalance(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	walletAddress := vars["address"]
	
	if !common.IsHexAddress(walletAddress) {
		http.Error(w, "Invalid wallet address", http.StatusBadRequest)
		return
	}
	
	balance, err := s.GetBalance(walletAddress)
	if err != nil {
		log.Printf("Error getting balance: %v", err)
		http.Error(w, "Failed to get balance", http.StatusInternalServerError)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(balance)
}

func (s *BetterCoinService) handleGetTokenInfo(w http.ResponseWriter, r *http.Request) {
	// This would require more contract calls to get name, symbol, etc.
	// For simplicity, returning static info that matches our contract
	tokenInfo := TokenInfo{
		Name:     "BetterCoin",
		Symbol:   "MBC",
		Decimals: 18,
		// TotalSupply and Owner would need contract calls
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tokenInfo)
}

func (s *BetterCoinService) handleHealthCheck(w http.ResponseWriter, r *http.Request) {
	response := map[string]string{
		"status":    "healthy",
		"service":   "BetterCoin Backend",
		"contract":  s.contractAddress.Hex(),
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	// Configuration from environment variables
	rpcURL := os.Getenv("RPC_URL")
	if rpcURL == "" {
		rpcURL = "http://localhost:8545" // Default to local Hardhat
	}
	
	contractAddress := os.Getenv("CONTRACT_ADDRESS")
	if contractAddress == "" {
		log.Fatal("CONTRACT_ADDRESS environment variable is required")
	}
	
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	// Initialize service
	service, err := NewBetterCoinService(rpcURL, contractAddress)
	if err != nil {
		log.Fatalf("Failed to initialize service: %v", err)
	}
	
	// Setup routes
	router := mux.NewRouter()
	
	// API routes
	api := router.PathPrefix("/api/v1").Subrouter()
	api.HandleFunc("/health", service.handleHealthCheck).Methods("GET")
	api.HandleFunc("/token/info", service.handleGetTokenInfo).Methods("GET")
	api.HandleFunc("/balance/{address}", service.handleGetBalance).Methods("GET")
	
	// CORS middleware
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			
			next.ServeHTTP(w, r)
		})
	})
	
	fmt.Printf("BetterCoin Backend API starting on port %s\n", port)
	fmt.Printf("Contract Address: %s\n", contractAddress)
	fmt.Printf("RPC URL: %s\n", rpcURL)
	
	log.Fatal(http.ListenAndServe(":"+port, router))
}

/*
Example Usage:

1. Install dependencies:
   go mod init bettercoin-backend
   go get github.com/ethereum/go-ethereum
   go get github.com/gorilla/mux

2. Set environment variables:
   export CONTRACT_ADDRESS=0x123...abc
   export RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   export PORT=8080

3. Run the service:
   go run main.go

4. Test endpoints:
   curl http://localhost:8080/api/v1/health
   curl http://localhost:8080/api/v1/balance/0x742d35cc6647c7f06c3a0532a8b4c3c4f8b8c8d8
   curl http://localhost:8080/api/v1/token/info

5. Minecraft Integration:
   - Use these APIs from your Minecraft server
   - Check player balances before transactions
   - Reward players with tokens (requires owner wallet integration)
   - Create in-game economies based on token balances
*/