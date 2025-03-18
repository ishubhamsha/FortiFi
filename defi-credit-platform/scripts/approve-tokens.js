const hre = require("hardhat");

async function main() {
  const lendingTokenAddress = "0xfa8FeB85eA57dd89bA62523330D245047B787F5D";
  const platformAddress = "0x349ba45f5b94692f14FCAF35ea7F016F769611c3";
  const userAddress = "0xeBf4d7801fA125a2f75AD388E955dd29F3ED555F";

  const LendingToken = await hre.ethers.getContractFactory("LendingToken");
  const lendingToken = await LendingToken.attach(lendingTokenAddress);

  // Check current allowance
  const allowance = await lendingToken.allowance(userAddress, platformAddress);
  console.log(`Current allowance: ${hre.ethers.formatEther(allowance)} tokens`);

  // Approve platform to spend tokens
  const approveAmount = hre.ethers.parseEther("100000"); // Approve a large amount
  await lendingToken.approve(platformAddress, approveAmount);
  console.log(`Approved ${hre.ethers.formatEther(approveAmount)} tokens for platform`);

  // Check balance
  const balance = await lendingToken.balanceOf(userAddress);
  console.log(`Current balance: ${hre.ethers.formatEther(balance)} tokens`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
