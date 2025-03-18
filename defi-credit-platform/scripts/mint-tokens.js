const hre = require("hardhat");

async function main() {
  const lendingTokenAddress = "0xfa8FeB85eA57dd89bA62523330D245047B787F5D";
  const userAddress = "0xeBf4d7801fA125a2f75AD388E955dd29F3ED555F";

  const LendingToken = await hre.ethers.getContractFactory("LendingToken");
  const lendingToken = await LendingToken.attach(lendingTokenAddress);

  // Mint 10000 tokens to the user
  const mintAmount = hre.ethers.parseEther("10000");
  await lendingToken.mint(userAddress, mintAmount);
  console.log(`Minted ${hre.ethers.formatEther(mintAmount)} tokens to ${userAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
