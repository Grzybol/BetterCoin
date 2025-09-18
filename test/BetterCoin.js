const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BetterCoin", function () {
  let BetterCoin;
  let betterCoin;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  const INITIAL_SUPPLY = ethers.parseEther("1000000"); // 1 million tokens

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    BetterCoin = await ethers.getContractFactory("BetterCoin");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new BetterCoin contract for each test.
    betterCoin = await BetterCoin.deploy();
    await betterCoin.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await betterCoin.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await betterCoin.balanceOf(owner.address);
      expect(await betterCoin.totalSupply()).to.equal(ownerBalance);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should have correct token details", async function () {
      expect(await betterCoin.name()).to.equal("BetterCoin");
      expect(await betterCoin.symbol()).to.equal("MBC");
      expect(await betterCoin.decimals()).to.equal(18);
    });

    it("Should return correct token info", async function () {
      const tokenInfo = await betterCoin.getTokenInfo();
      expect(tokenInfo.name_).to.equal("BetterCoin");
      expect(tokenInfo.symbol_).to.equal("MBC");
      expect(tokenInfo.decimals_).to.equal(18);
      expect(tokenInfo.totalSupply_).to.equal(INITIAL_SUPPLY);
      expect(tokenInfo.owner_).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      
      await expect(betterCoin.mint(addr1.address, mintAmount))
        .to.emit(betterCoin, "TokensMinted")
        .withArgs(addr1.address, mintAmount);
      
      expect(await betterCoin.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await betterCoin.totalSupply()).to.equal(INITIAL_SUPPLY + mintAmount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      
      await expect(
        betterCoin.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWithCustomError(betterCoin, "OwnableUnauthorizedAccount");
    });

    it("Should not allow minting to zero address", async function () {
      const mintAmount = ethers.parseEther("1000");
      
      await expect(
        betterCoin.mint(ethers.ZeroAddress, mintAmount)
      ).to.be.revertedWith("BetterCoin: cannot mint to zero address");
    });

    it("Should not allow minting zero amount", async function () {
      await expect(
        betterCoin.mint(addr1.address, 0)
      ).to.be.revertedWith("BetterCoin: amount must be greater than 0");
    });
  });

  describe("Burning by owner", function () {
    beforeEach(async function () {
      // Transfer some tokens to addr1 for burn tests
      await betterCoin.transfer(addr1.address, ethers.parseEther("1000"));
    });

    it("Should allow owner to burn tokens from any address", async function () {
      const burnAmount = ethers.parseEther("500");
      const initialBalance = await betterCoin.balanceOf(addr1.address);
      const initialTotalSupply = await betterCoin.totalSupply();

      await expect(betterCoin.burn(addr1.address, burnAmount))
        .to.emit(betterCoin, "TokensBurned")
        .withArgs(addr1.address, burnAmount);

      expect(await betterCoin.balanceOf(addr1.address)).to.equal(
        initialBalance - burnAmount
      );
      expect(await betterCoin.totalSupply()).to.equal(
        initialTotalSupply - burnAmount
      );
    });

    it("Should not allow non-owner to burn tokens from other addresses", async function () {
      const burnAmount = ethers.parseEther("500");
      
      await expect(
        betterCoin.connect(addr1).burn(addr2.address, burnAmount)
      ).to.be.revertedWithCustomError(betterCoin, "OwnableUnauthorizedAccount");
    });

    it("Should not allow burning from zero address", async function () {
      const burnAmount = ethers.parseEther("500");
      
      await expect(
        betterCoin.burn(ethers.ZeroAddress, burnAmount)
      ).to.be.revertedWith("BetterCoin: cannot burn from zero address");
    });

    it("Should not allow burning zero amount", async function () {
      await expect(
        betterCoin.burn(addr1.address, 0)
      ).to.be.revertedWith("BetterCoin: amount must be greater than 0");
    });

    it("Should not allow burning more than balance", async function () {
      const balance = await betterCoin.balanceOf(addr1.address);
      const burnAmount = balance + ethers.parseEther("1");
      
      await expect(
        betterCoin.burn(addr1.address, burnAmount)
      ).to.be.revertedWith("BetterCoin: burn amount exceeds balance");
    });
  });

  describe("Self burning", function () {
    beforeEach(async function () {
      // Transfer some tokens to addr1 for burn tests
      await betterCoin.transfer(addr1.address, ethers.parseEther("1000"));
    });

    it("Should allow users to burn their own tokens", async function () {
      const burnAmount = ethers.parseEther("300");
      const initialBalance = await betterCoin.balanceOf(addr1.address);
      const initialTotalSupply = await betterCoin.totalSupply();

      await expect(betterCoin.connect(addr1).burnOwnTokens(burnAmount))
        .to.emit(betterCoin, "TokensBurned")
        .withArgs(addr1.address, burnAmount);

      expect(await betterCoin.balanceOf(addr1.address)).to.equal(
        initialBalance - burnAmount
      );
      expect(await betterCoin.totalSupply()).to.equal(
        initialTotalSupply - burnAmount
      );
    });

    it("Should not allow burning zero amount of own tokens", async function () {
      await expect(
        betterCoin.connect(addr1).burnOwnTokens(0)
      ).to.be.revertedWith("BetterCoin: amount must be greater than 0");
    });

    it("Should not allow burning more than own balance", async function () {
      const balance = await betterCoin.balanceOf(addr1.address);
      const burnAmount = balance + ethers.parseEther("1");
      
      await expect(
        betterCoin.connect(addr1).burnOwnTokens(burnAmount)
      ).to.be.revertedWith("BetterCoin: burn amount exceeds balance");
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("100");
      
      await betterCoin.transfer(addr1.address, transferAmount);
      expect(await betterCoin.balanceOf(addr1.address)).to.equal(transferAmount);

      await betterCoin.connect(addr1).transfer(addr2.address, transferAmount);
      expect(await betterCoin.balanceOf(addr1.address)).to.equal(0);
      expect(await betterCoin.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await betterCoin.balanceOf(owner.address);
      const transferAmount = initialOwnerBalance + ethers.parseEther("1");

      await expect(
        betterCoin.transfer(addr1.address, transferAmount)
      ).to.be.revertedWithCustomError(betterCoin, "ERC20InsufficientBalance");
    });
  });

  describe("Allowances", function () {
    it("Should approve and transfer using allowance", async function () {
      const approveAmount = ethers.parseEther("100");
      const transferAmount = ethers.parseEther("50");

      await betterCoin.approve(addr1.address, approveAmount);
      expect(await betterCoin.allowance(owner.address, addr1.address)).to.equal(
        approveAmount
      );

      await betterCoin.connect(addr1).transferFrom(
        owner.address,
        addr2.address,
        transferAmount
      );

      expect(await betterCoin.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await betterCoin.allowance(owner.address, addr1.address)).to.equal(
        approveAmount - transferAmount
      );
    });
  });

  describe("Ownership", function () {
    it("Should allow owner to transfer ownership", async function () {
      await betterCoin.transferOwnership(addr1.address);
      expect(await betterCoin.owner()).to.equal(addr1.address);
    });

    it("Should not allow non-owner to transfer ownership", async function () {
      await expect(
        betterCoin.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWithCustomError(betterCoin, "OwnableUnauthorizedAccount");
    });

    it("Should allow new owner to mint after ownership transfer", async function () {
      await betterCoin.transferOwnership(addr1.address);
      
      const mintAmount = ethers.parseEther("1000");
      await betterCoin.connect(addr1).mint(addr2.address, mintAmount);
      
      expect(await betterCoin.balanceOf(addr2.address)).to.equal(mintAmount);
    });
  });
});