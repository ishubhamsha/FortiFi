const hre = require("hardhat");

async function main() {
  const platformAddress = "0x349ba45f5b94692f14FCAF35ea7F016F769611c3";
  const userAddress = "0xeBf4d7801fA125a2f75AD388E955dd29F3ED555F";

  const MicroLendingPlatform = await hre.ethers.getContractFactory("MicroLendingPlatform");
  const platform = await MicroLendingPlatform.attach(platformAddress);

  // Get the DAO_MEMBER_ROLE bytes32 value
  const DAO_MEMBER_ROLE = await platform.DAO_MEMBER_ROLE();
  
  // Grant DAO member role to the user
  await platform.grantRole(DAO_MEMBER_ROLE, userAddress);
  console.log(`Granted DAO member role to ${userAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
