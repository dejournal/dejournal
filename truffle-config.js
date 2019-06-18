const path = require("path");
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider("address birth merge bless duck poet wild cannon liquid woman silk upon", "https://rinkeby.infura.io/v3/39c7d62ef81043928e8ccf482f54cf9d");
      },
      network_id: 4,
      /*host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0x84956845e31Bd49ECc52F9074e0Bc521ad32c3D5", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys*/
    }
  }
};