const { assert } = require("chai");

const main = async () => {
  const [owner, addr1, addr2, addr3] = await hre.ethers.getSigners();
  const PokeFactory = await hre.ethers.getContractFactory("Poke");
  const pokeContract = await PokeFactory.deploy({});
  await pokeContract.deployed();

  console.log("Contract deployed to:", pokeContract.address);
  console.log("Contract deployed by:", owner.address);

  let pokeTxn = await pokeContract.connect(addr1).poke(addr3.address);
  await pokeTxn.wait();

  let pokeTxn2 = await pokeContract.connect(addr2).poke(addr3.address);
  await pokeTxn2.wait();

  let interactions = await pokeContract.getInteractionsForAddress(
    addr3.address
  );
  assert.strictEqual(interactions.length, 2);

  let checkForFirstPoke = await pokeContract.checkForPoke(
    interactions[0],
    addr3.address
  );
  assert.isTrue(checkForFirstPoke);

  let checkForSecondPoke = await pokeContract.checkForPoke(
    interactions[1],
    addr3.address
  );
  assert.isTrue(checkForSecondPoke);

  let pokeBack = await pokeContract.connect(addr3).poke(addr1.address);
  await pokeBack.wait();

  // addr3 poked addr1 back, so the original poke was negated
  let checkForFirstPokeAgain = await pokeContract.checkForPoke(
    addr1.address,
    addr3.address
  );
  assert.isFalse(checkForFirstPokeAgain);

  let checkForPokeBack = await pokeContract.checkForPoke(
    addr3.address,
    addr1.address
  );
  assert.isTrue(checkForPokeBack);

  console.log(`successful poke`);
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
