const { assert } = require("chai");

const main = async () => {
  const [owner, ...signers] = await ethers.getSigners();
  const thePoked = await hre.ethers.Wallet.createRandom();
  const PokeFactory = await hre.ethers.getContractFactory("Poke");
  const pokeContract = await PokeFactory.deploy({});
  await pokeContract.deployed();

  console.log("Contract deployed to:", pokeContract.address);
  console.log("Contract deployed by:", owner.address);

  //const STRESS = 10;
  for (let i = 0; i < signers.length; i++) {
    let pokeTxn = await pokeContract.connect(signers[i]).poke(thePoked.address);
    await pokeTxn.wait();

    console.time(`getInteractions ${i} poke`);
    let interactions = await pokeContract.getInteractionsForAddress(
      thePoked.address
    );
    console.timeEnd(`getInteractions ${i} poke`);

    console.time(`fetchInteractionsPaginated ${i} poke`);
    const pageSize = 100;
    if (i > pageSize) {
      const cursor = parseInt(i / pageSize) * pageSize;
      let interactionsPaginated = await pokeContract.fetchInteractionsPaginated(
        thePoked.address,
        cursor,
        pageSize
      );
      console.log(interactionsPaginated[0].length);
      console.timeEnd(`fetchInteractionsPaginated ${i} poke`);
    }

    console.time(`checkForPoke ${i} poke`);
    let pokeCheck = await pokeContract.checkForPoke(
      signers[i].address,
      thePoked.address
    );
    assert.isTrue(pokeCheck);
    console.timeEnd(`checkForPoke ${i} poke`);

    assert.strictEqual(interactions.length, i + 1);
  }
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
