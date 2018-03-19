pragma solidity ^0.4.14;

import "./schnorr.sol";

contract ZKProof
{
	function createProof( uint256 secret, uint256 message )
	    constant
	    returns (uint256[2] out_pubkey, uint256 out_s, uint256 out_e)
	{
		return Schnorr.CreateProof(secret,message);
	}

	function verifyProof( uint256[2] pubkey, uint256 message, uint256 s, uint256 e )
	    constant
	    returns (bool)
	{
	    return Schnorr.VerifyProof(pubkey, message, s, e);
	}
}