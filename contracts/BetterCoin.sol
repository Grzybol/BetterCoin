// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BetterCoin (MBC)
 * @dev ERC-20 token for Minecraft ecosystem with owner-controlled mint/burn functionality
 * @author BetterCoin Team
 */
contract BetterCoin is ERC20, Ownable {
    // Initial supply: 1 million tokens (with 18 decimals)
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18;
    
    // Events for mint and burn operations
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    
    /**
     * @dev Constructor that mints initial supply to deployer
     */
    constructor() ERC20("BetterCoin", "MBC") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Mint new tokens (only owner can call)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint (in wei, considering 18 decimals)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "BetterCoin: cannot mint to zero address");
        require(amount > 0, "BetterCoin: amount must be greater than 0");
        
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Burn tokens from a specific address (only owner can call)
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn (in wei, considering 18 decimals)
     */
    function burn(address from, uint256 amount) public onlyOwner {
        require(from != address(0), "BetterCoin: cannot burn from zero address");
        require(amount > 0, "BetterCoin: amount must be greater than 0");
        require(balanceOf(from) >= amount, "BetterCoin: burn amount exceeds balance");
        
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }
    
    /**
     * @dev Burn tokens from caller's own balance
     * @param amount Amount of tokens to burn from caller's balance
     */
    function burnOwnTokens(uint256 amount) public {
        require(amount > 0, "BetterCoin: amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "BetterCoin: burn amount exceeds balance");
        
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @dev Get token information
     */
    function getTokenInfo() public view returns (
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 totalSupply_,
        address owner_
    ) {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply(),
            owner()
        );
    }
}