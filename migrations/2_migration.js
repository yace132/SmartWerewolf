//var Curve = artifacts.require("./Curve.sol");
//var Schnorr = artifacts.require("./schnorr.sol");
var ZKProof = artifacts.require("./ZKProof.sol");

module.exports = function(deployer) {
  deployer.deploy(ZKProof);
};
