#!/bin/bash

# BetterCoin Complete Demo Script
# This script demonstrates the full BetterCoin workflow

echo "🚀 BetterCoin (MBC) Complete Demo"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "hardhat.config.js" ]; then
    print_error "Please run this script from the BetterCoin project root directory."
    exit 1
fi

print_step "1. Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

print_step "2. Compiling smart contracts..."
npm run compile
if [ $? -eq 0 ]; then
    print_success "Contracts compiled successfully"
else
    print_warning "Compilation failed - this might be due to network issues downloading Solidity compiler"
    print_warning "You can continue with pre-compiled artifacts or try again later"
fi

print_step "3. Running contract tests..."
npm run test
if [ $? -eq 0 ]; then
    print_success "All tests passed!"
else
    print_warning "Tests failed - this might be due to compilation issues"
fi

echo ""
print_step "4. Starting local Hardhat network (in background)..."
npx hardhat node &
HARDHAT_PID=$!
sleep 5

print_step "5. Deploying BetterCoin to local network..."
npm run deploy:hardhat
if [ $? -eq 0 ]; then
    print_success "BetterCoin deployed successfully!"
    
    print_step "6. Testing contract interactions..."
    npm run test:interactions
    if [ $? -eq 0 ]; then
        print_success "Contract interactions tested successfully!"
    else
        print_warning "Contract interaction tests failed"
    fi
else
    print_error "Deployment failed"
fi

# Cleanup
print_step "7. Cleaning up..."
if [ ! -z "$HARDHAT_PID" ]; then
    kill $HARDHAT_PID
    print_success "Stopped Hardhat network"
fi

echo ""
echo "🎉 Demo completed!"
echo ""
echo "📚 Next steps:"
echo "   1. Check the deployments/ folder for contract address"
echo "   2. Configure MetaMask with local network (http://localhost:8545)"
echo "   3. Import BetterCoin token using the contract address"
echo "   4. Try the backend API examples in examples/backend/"
echo "   5. Explore the documentation in docs/"
echo ""
echo "🔧 Available commands:"
echo "   npm run compile         - Compile contracts"
echo "   npm run test            - Run test suite"
echo "   npm run node            - Start local network"
echo "   npm run deploy:hardhat  - Deploy to local network"
echo "   npm run deploy:sepolia  - Deploy to Sepolia testnet"
echo ""
echo "📖 Documentation:"
echo "   docs/metamask-guide.md  - MetaMask integration"
echo "   docs/remix-guide.md     - Remix IDE usage"
echo "   examples/backend/       - Backend API examples"
echo ""
print_success "BetterCoin is ready for your Minecraft ecosystem!"