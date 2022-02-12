const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const hotDogContractFactory = await hre.ethers.getContractFactory(
    "HotDogSender"
  );
  const hotDogContract = await hotDogContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await hotDogContract.deployed();

  console.log("HotDogPortal address: ", hotDogContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
