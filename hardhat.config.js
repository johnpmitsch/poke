require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const pk = process.env.WAGMI_PK;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      accounts: {
        count: 1000,
      },
    },
    wagmi: {
      url: "https://api.trywagmi.xyz/rpc",
      gasPrice: 225000000000,
      chainId: 11111,
      accounts: [`${pk}`],
    },
    ropsten: {
      // 0x4e1383aC9472c3BdE729d50b075BD75D9C912544
      url: "https://eth-ropsten.alchemyapi.io/v2/0v4LTsBLo1CXmlNXAjWW-krAPdDzWwWN",
      accounts: [`${pk}`],
    },
  },
};
