// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BetterCoin
 * @notice An ERC-20 token for the BetterCoin Minecraft ecosystem.
 * The contract mints an initial supply to the deployer and allows the owner
 * to mint or burn tokens in the future for administrative supply management.
 */
contract BetterCoin is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;

    constructor(address initialOwner) ERC20("BetterCoin", "MBC") Ownable(initialOwner) {
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    /**
     * @notice Mint new tokens to a given address. Only callable by the owner.
     * @param account The recipient of the newly minted tokens.
     * @param amount The amount of tokens to mint (in wei units).
     */
    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    /**
     * @notice Burn tokens from a given address. Only callable by the owner.
     * @param account The address whose tokens will be burned.
     * @param amount The amount of tokens to burn (in wei units).
     */
    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}
