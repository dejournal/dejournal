const Dejournal = artifacts.require("Dejournal");

module.exports = function(deployer) {
  deployer.deploy(Dejournal,1000);
};