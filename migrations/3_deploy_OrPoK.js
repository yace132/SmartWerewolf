var Werewolf = artifacts.require("./OrPoK.sol");

module.exports = function(deployer, accounts) {
	/*deployer.deploy(ECC);
	deployer.deploy(Curve);
	deployer.link(ECC,[Curve,Werewolf])
	deployer.link(Curve,Werewolf)*/
	deployer.deploy(Werewolf);
	//console.log('code ... \n'+JSON.stringify(Werewolf.bytecode));
};