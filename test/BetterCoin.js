const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BetterCoin", function () {
  async function deployFixture() {
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();
    const BetterCoin = await ethers.getContractFactory("BetterCoin");
    const token = await BetterCoin.deploy(owner.address);
    await token.waitForDeployment();
    return { token, owner, otherAccount, thirdAccount };
  }

  describe("Deployment", function () {
    it("mints the initial supply to the owner", async function () {
      const { token, owner } = await deployFixture();
      const decimals = await token.decimals();
      const expectedSupply = ethers.parseUnits("1000000", decimals);
      expect(await token.totalSupply()).to.equal(expectedSupply);
      expect(await token.balanceOf(owner.address)).to.equal(expectedSupply);
    });
  });

  describe("Minting", function () {
    it("allows the owner to mint to another account", async function () {
      const { token, owner, otherAccount } = await deployFixture();
      const amount = ethers.parseUnits("2500", await token.decimals());
      await expect(token.connect(owner).mint(otherAccount.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(ethers.ZeroAddress, otherAccount.address, amount);
      expect(await token.balanceOf(otherAccount.address)).to.equal(amount);
    });

    it("reverts when a non-owner tries to mint", async function () {
      const { token, otherAccount, thirdAccount } = await deployFixture();
      const amount = ethers.parseUnits("1", await token.decimals());
      await expect(
        token.connect(otherAccount).mint(thirdAccount.address, amount)
      )
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);
    });
  });

  describe("Burning", function () {
    it("allows the owner to burn from an account", async function () {
      const { token, owner, otherAccount } = await deployFixture();
      const decimals = await token.decimals();
      const mintAmount = ethers.parseUnits("1000", decimals);
      await token.mint(otherAccount.address, mintAmount);
      await expect(token.burn(otherAccount.address, mintAmount))
        .to.emit(token, "Transfer")
        .withArgs(otherAccount.address, ethers.ZeroAddress, mintAmount);
      expect(await token.balanceOf(otherAccount.address)).to.equal(0);
    });

    it("reverts when a non-owner tries to burn", async function () {
      const { token, owner, otherAccount } = await deployFixture();
      const decimals = await token.decimals();
      const burnAmount = ethers.parseUnits("10", decimals);
      await expect(token.connect(otherAccount).burn(owner.address, burnAmount))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);
    });
  });
});
