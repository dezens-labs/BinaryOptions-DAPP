require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: "B9SEZ4K5MAMTI9FEPDQRBIQP9GW4WN5GFG",
  },
  networks : {
    goerli : {
      url : "https://morning-proud-log.ethereum-goerli.discover.quiknode.pro/54ba1889078030f0d9e7e11cb49481298b031637/",
      accounts : ["059bcd5d85e0f99074148e694668d244d90b98bc50bc1c8d4f26785741a5e4c9"],
    }
  }
};