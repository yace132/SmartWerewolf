var Werewolf = artifacts.require("./SmartWerewolf.sol");
var OrPoK = artifacts.require("./OrPoK.sol");

module.exports = function(deployer, accounts) {
	deployer.deploy(OrPoK).then(function() {
		return deployer.deploy(Werewolf, OrPoK.address)
	});
};




  
