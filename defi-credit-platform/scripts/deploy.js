const hre = require("hardhat");

async function main() {
  // Deploy PriceOracle
  const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
  const priceOracle = await PriceOracle.deploy();
  await priceOracle.waitForDeployment();
  const priceOracleAddress = await priceOracle.getAddress();
  console.log("PriceOracle deployed to:", priceOracleAddress);
  // First deploy the ERC20 token that will be used for lending
  const LendingToken = await hre.ethers.getContractFactory("LendingToken");
  const lendingToken = await LendingToken.deploy("Lending Token", "LEND");
  await lendingToken.waitForDeployment();
  const lendingTokenAddress = await lendingToken.getAddress();
  console.log("LendingToken deployed to:", lendingTokenAddress);

  // Deploy the lending platform with the token address
  const MicroLendingPlatform = await hre.ethers.getContractFactory("MicroLendingPlatform");
  const microLendingPlatform = await MicroLendingPlatform.deploy(lendingTokenAddress, priceOracleAddress);
  await microLendingPlatform.waitForDeployment();
  const platformAddress = await microLendingPlatform.getAddress();
  console.log("MicroLendingPlatform deployed to:", platformAddress);

  // Mint some tokens to the lending platform
  const mintAmount = hre.ethers.parseEther("1000000"); // 1 million tokens
  await lendingToken.mint(platformAddress, mintAmount);
  console.log("Minted", hre.ethers.formatEther(mintAmount), "tokens to the lending platform");

  // Verify contracts on Basescan
  if (process.env.BASESCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    // Wait for 6 block confirmations
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60 seconds

    await hre.run("verify:verify", {
      address: lendingTokenAddress,
      constructorArguments: ["Lending Token", "LEND"],
    });

    await hre.run("verify:verify", {
      address: platformAddress,
      constructorArguments: [lendingTokenAddress],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
