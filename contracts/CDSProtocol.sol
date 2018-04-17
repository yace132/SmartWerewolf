pragma solidity ^0.4.14;

import "./Curve.sol";

library CDSProtocol
{
	function CreateProof( uint256 secret, uint256 message )
	    constant internal
	    returns (uint256[2] out_pubkey, uint256 out_s, uint256 out_e)
	{
		Curve.G1Point memory xG = Curve.g1mul(Curve.P1(), secret % Curve.N());
		out_pubkey[0] = xG.X;
		out_pubkey[1] = xG.Y;
		uint256 k = uint256(keccak256(message, secret)) % Curve.N();
		Curve.G1Point memory kG = Curve.g1mul(Curve.P1(), k);
		out_e = uint256(keccak256(out_pubkey[0], out_pubkey[1], kG.X, kG.Y, message));
		out_s = Curve.submod(k, mulmod(secret, out_e, Curve.N()));
	}

	// Costs ~85000 gas, 2x ecmul, 1x ecadd, + small overheads
	function CalcProof( uint256[2] pubkey, uint256 message, uint256 s, uint256 e )
	    constant internal
	    returns (uint256)
	{
	    Curve.G1Point memory sG = Curve.g1mul(Curve.P1(), s % Curve.N());
	    Curve.G1Point memory xG = Curve.G1Point(pubkey[0], pubkey[1]);
	    Curve.G1Point memory kG = Curve.g1add(sG, Curve.g1mul(xG, e));
	    return uint256(keccak256(pubkey[0], pubkey[1], kG.X, kG.Y, message));
	}
	
	function VerifyProof( uint256[2] pubkey, uint256 message, uint256 s, uint256 e )
	    constant internal
	    returns (bool)
	{
	    return e == CalcProof(pubkey, message, s, e);
	}
}