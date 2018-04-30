pragma solidity ^0.4.7;
pragma experimental ABIEncoderV2;
import "./ECCMath_noconflict.sol";
import "./Secp256k1_noconflict.sol";

contract OrPoK {
    
    uint constant p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;

    // Base point (generator) G
    // Eason: represent werewolf
    uint constant Gx =0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
    uint constant Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;
    uint constant Hx = 0xEC70EDA5ABD3416F239EF65D4B288717C4CF7BA469776869F2AAE2E00DF74DCA;
    uint constant Hy = 0xEF7824FF7E7F248BF1C94F61C04A69C4D9DB232C86D85478B97E87753114DE2D;
    

    //Eason: oredr of elliptic curve
    //coefficient in Zq 
    uint public constant q = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;



    uint[2] public G;
    uint[2] public H;
    
    uint[2][] public problems;//ECDLP for G
    PoK[] public proofs;
    function OrPoK() public{
        G[0] = Gx;
        G[1] = Gy;
        H[0] = Hx;
        H[1] = Hy;
    }

    function easySetProblems(uint real, uint[] pokerKeys) public {
        problems.length = pokerKeys.length;
        for(uint i=0; i<real; i++){
            uint[3] memory secretH = Secp256k1_noconflict._mul(pokerKeys[i], H);
            ECCMath_noconflict.toZ1(secretH,p);
            (problems[i][0],problems[i][1]) = (secretH[0],secretH[1]);
        }
        uint[3] memory secretG = Secp256k1_noconflict._mul(pokerKeys[i], G);
        ECCMath_noconflict.toZ1(secretG,p);
        (problems[i][0],problems[i][1]) = (secretG[0],secretG[1]);
        for(i= real+1; i<problems.length; i++){
            secretH = Secp256k1_noconflict._mul(pokerKeys[i], H);
            ECCMath_noconflict.toZ1(secretH,p);
            (problems[i][0],problems[i][1]) = (secretH[0],secretH[1]);
        }      
    }

    function getProblems(uint i) public view returns(uint[2] point){
        assert(i< problems.length);
        return problems[i];
    }//getter for outside world

    function getProblemsLength() public view returns(uint){
        
        return problems.length;
    }//getter for outside world

    //input is "t", move t,c to easy version
    function createSchnorr(uint pokerKey, uint[2] werewolf, uint[2] liveHand, uint victim, uint tReady,uint cReady) public view returns(uint[2] g, uint[2] A, uint message, uint[3] T, uint c, uint s){
        //input: conditions 
        //output: conditions & PoK
        uint secret = pokerKey;
        (g[0],g[1]) = (werewolf[0],werewolf[1]);
        (A[0],A[1]) = (liveHand[0],liveHand[1]);
        message = victim;
        
        uint[3] memory secretG = Secp256k1_noconflict._mul(secret, g);
        ECCMath_noconflict.toZ1(secretG,p);
        require(secretG[0] == A[0] && secretG[1] == A[1]);
        
        uint t;
        if(tReady != 0 && cReady != 0){
            t = tReady;
            T = Secp256k1_noconflict._mul(t, G);
            ECCMath_noconflict.toZ1(T,p);
            c = cReady;
        }else{
            t = uint(keccak256(G,A,message)) % q;//add index of proof?
            //TODO: add some randomness
            T = Secp256k1_noconflict._mul(t, G);
            ECCMath_noconflict.toZ1(T,p);
            c=uint(keccak256(G,A, message,T)) % q;
        }
        s = addmod(mulmod(secret,c,q),t,q);
    }

    function easyCreateSchnorr(uint real, uint pokerKey, uint victim, uint tReady, uint cReady) public view returns(uint[2] g, uint[2] A, uint message, uint[3] T, uint c, uint s){
        
        return createSchnorr(pokerKey, G, problems[ real ], victim, tReady, cReady);
    }

    
    // m - 1 fake proof
    function forgeProof(uint[2] werewolf, uint[2] liveHand, uint victim) public view returns(uint[2] _H, uint[2] B,uint message, uint[3] T2, uint c2, uint s2){
        (_H[0],_H[1]) = (werewolf[0],werewolf[1]);
        (B[0],B[1])=(liveHand[0],liveHand[1]);
        message = victim;

        c2 = uint(keccak256(uint8(1),B, message)) % q;//choose a random # by self
        s2 = uint(keccak256(uint8(2),B, message)) % q;//choose a random # by self
        uint[3] memory s2H = Secp256k1_noconflict._mul(s2, _H);
        uint[3] memory c2B = Secp256k1_noconflict._mul(c2, B);
        ECCMath_noconflict.toZ1(c2B,p);
        //T2 = Secp256k1_noconflict._mul(q-1,[c2B[0],c2B[1]]);
        T2 = [c2B[0],p-c2B[1],1];//negative in affine?
        T2 = Secp256k1_noconflict._add(s2H, T2);//The negative in Jacobi coordinates?
        ECCMath_noconflict.toZ1(T2,p);
    }

    function easyForgeProof(uint i,uint victim) public view returns(uint[2] h, uint[2] B,uint message, uint[3] T2, uint c2, uint s2){
        return forgeProof(G, problems[i], victim);
        //function forgeProof can't overloading. work around : rename 
    }
/*
    //can be ommited?
    //1 real proof
    function easyComputeT(uint pokerKey,  uint victim, uint real) public view returns(uint[3] realT){
        //i) choose t
        uint realt = uint(keccak256(G, problems, victim));//need other T??
        realt = uint(keccak256(realt, pokerKey)) % q;//avoid stack too deep
        //add index of proof? pokerKey instead
        //add pokerKey for randomnes
        //ii) compute T
        realT = Secp256k1_noconflict._mul(realt, G);
        ECCMath_noconflict.toZ1(realT,p);
    }
*/
    function computeRealt(uint[2] _G, uint[2][] _problems, uint pokerKey,  uint victim)public view returns(uint realt){
        realt = uint(keccak256(_G, _problems, victim));
        realt = uint(keccak256(realt, pokerKey)) % q;
    }
    //1 real proof
    function easyComputeRealt(uint pokerKey,  uint victim, uint real) public view returns(uint realt){
        return computeRealt(G, problems, pokerKey,  victim);
        //i) choose t
        realt = uint(keccak256(G, problems, victim));//need other T??
        realt = uint(keccak256(realt, pokerKey)) % q;//avoid stack too deep
        //add index of proof? pokerKey instead
        //add pokerKey for randomnes
    }

    //1 real proof
    function computeTFrom(uint realt, uint[2] _G) public view returns(uint[3] realT){
        //ii) compute T
        realT = Secp256k1_noconflict._mul(realt, _G);
        ECCMath_noconflict.toZ1(realT,p);
    }

    function easyComputeTFrom(uint realt) public view returns(uint[3] realT){
        //ii) compute T
        return computeTFrom(realt, G);
    }

    function computeChallenge(uint[2] _G, uint[2][] _problems, uint victim, uint real, uint[3][] Ts) public view returns(uint realChallenge){
        //iii) compute c
        realChallenge = uint(keccak256(_G, _problems, victim,Ts)) % q;
        //realChallenge = addmod(realChallenge, q-totalFakeC, q);//submod, avoid rounding when negative
    }

    function easyComputeChallenge(uint victim, uint real, uint[3][] Ts) public view returns(uint realChallenge){
        return computeChallenge(G, problems, victim, real, Ts);
    }

    
    function publishProofs(uint pokerKey, uint[2] werewolf, uint[2][] liveHands, uint victim, uint real) public{
        //input: conditions 
        //output: store conditions & PoK

        require(real<liveHands.length);
        
        uint totalFakeC = 0;
        uint[3][ ] memory T = new uint[3][](liveHands.length);

        // m-1 "fake" proof
        uint i=0;
        proofs.length = liveHands.length;
        PoK storage pf = proofs[0];

        for( i=0; i<real; i++){
            emit Process(i); 
            pf = proofs[i];
            (pf.g, pf.A, pf.message,) = forgeProof(werewolf,liveHands[i],victim);
            (, pf.T, pf.c, pf.s) = forgeProof(werewolf,liveHands[i],victim);
            //Just avoid stack too deep
            
            
            totalFakeC = addmod(totalFakeC, pf.c, q);
            T[i] = pf.T;

        }

        for( i=real+1; i<liveHands.length; i++){
            emit Process(i);
            pf = proofs[i]; 
            (pf.g, pf.A, pf.message,) = forgeProof(werewolf,liveHands[i],victim);
            (, pf.T, pf.c, pf.s) = forgeProof(werewolf,liveHands[i],victim);
            //Just avoid stack too deep
            totalFakeC = addmod(totalFakeC, pf.c, q);
            T[i] = pf.T;
        }
        emit Process(real);
        //1 real proof
        pf = proofs[ real ];
        
        //i) choose t
        uint realt = uint(keccak256(werewolf, liveHands, victim));
        realt = uint(keccak256(realt, pokerKey)) % q;//avoid stack too deep
        //add index of proof? pokerKey instead
        //add pokerKey for randomness
        
        //ii) compute T
        uint[3] memory realT = Secp256k1_noconflict._mul(realt, werewolf);
        ECCMath_noconflict.toZ1(realT,p);
        T[ real ] = realT;
        
        //iii) compute c
        uint challenge = uint(keccak256(werewolf, liveHands, victim,T)) % q;
        uint realc = addmod(challenge, q-totalFakeC, q);//submod, avoid rounding when negative
        //iv) create proof
        (pf.g, pf.A, pf.message,) = createSchnorr(pokerKey,werewolf,liveHands[real],victim, realt, realc);
        (, pf.T, pf.c, pf.s) = createSchnorr(pokerKey,werewolf,liveHands[real],victim,realt,realc);
    }

    function easyPublishProofs(uint pokerKey, uint victim, uint real) public{
        assert(problems.length != 0);
        publishProofs(pokerKey, G, problems, victim, real);
    }

    function createProofs(uint pokerKey,  uint victim, uint real) public view returns(PoK[] pfs){//although we can use experimental abi in solidty. web3 may have not support it 
        //input: conditions 
        //output: store conditions & PoK
        //uint[2] memory werewolf= [G[0],G[1]];
        
        //require(real<problems.length);
        
        uint totalFakeC = 0;
        
        uint[3][ ] memory T = new uint[3][](problems.length);

        // m-1 "fake" proof
        uint i=0;
        pfs = new PoK[](problems.length);
        PoK memory pf = pfs[0];

        for( i=0; i<real; i++){
            pf = pfs[i];
            (pf.g, pf.A, pf.message,) = forgeProof(G,problems[i],victim);
            (, pf.T, pf.c, pf.s) = forgeProof(G,problems[i],victim);
            //Just avoid stack too deep
            
            
            totalFakeC = addmod(totalFakeC, pf.c, q);
            T[i] = pf.T;

        }

        for( i=real+1; i<problems.length; i++){
            pf = pfs[i]; 
            (pf.g, pf.A, pf.message,) = forgeProof(G,problems[i],victim);
            (, pf.T, pf.c, pf.s) = forgeProof(G,problems[i],victim);
            //Just avoid stack too deep
            totalFakeC = addmod(totalFakeC, pf.c, q);
            T[i] = pf.T;
        }
        //1 real proof
        pf = pfs[ real ];
        
        //i) choose t
        uint realt = uint(keccak256(G, problems, victim));
        realt = uint(keccak256(realt, pokerKey)) % q;//avoid stack too deep
        //add index of proof? pokerKey instead
        //add pokerKey for randomness
        
        //ii) compute T
        uint[3] memory realT = Secp256k1_noconflict._mul(realt, G);
        ECCMath_noconflict.toZ1(realT,p);
        T[ real ] = realT;
        
        //iii) compute c
        uint challenge = uint(keccak256(G, problems, victim,T)) % q;
        uint realc = addmod(challenge, q-totalFakeC, q);//submod, avoid rounding when negative
        //iv) create proof
        (pf.g, pf.A, pf.message,) = createSchnorr(pokerKey,G,problems[real],victim, realt, realc);
        (, pf.T, pf.c, pf.s) = createSchnorr(pokerKey,G,problems[real],victim,realt,realc);
    }

    /*function verifySchnorr(uint[2] g,uint[2] A, uint message, uint[3] T, uint c, uint s) public view returns (bool result) {
        if (!Secp256k1_noconflict.isPubKey(A)) return false;
        if (!Secp256k1_noconflict.isPubKey(T)) return false;
        
        //1 Check c   
        if (c!=uint(keccak256(g,A, message,T)) % q) return false;//Check the message
        
        //2 Check equation
        uint[3] memory LHS = Secp256k1_noconflict._mul(s, g);
        uint[3] memory RHS = Secp256k1_noconflict._add(T,Secp256k1_noconflict._mul(c, A));
        //_add: Jacobi -> Jacobi
        // Convert to Affine Co-ordinates
        ECCMath_noconflict.toZ1(LHS, p);
        ECCMath_noconflict.toZ1(RHS, p);
        // Verify. Do they match?
        if(RHS[0] == LHS[0] &&
           RHS[1] == LHS[1]) {
            return true;
        } else {
                return false;
            }
    }*/

    function verifySchnorr(uint[2] g,uint[2] A, /*uint message,*/ uint[3] T, uint c, uint s) public view returns (bool result) {
        if (!Secp256k1_noconflict.isPubKey(A)) return false;
        if (!Secp256k1_noconflict.isPubKey(T)) return false;
        //1 Check c   
        //if (c!=uint(keccak256(g,A, message,T)) % q) return false;//Check the message
        
        //2 Check equation
        uint[3] memory LHS = Secp256k1_noconflict._mul(s, g);
        uint[3] memory RHS = Secp256k1_noconflict._add(T,Secp256k1_noconflict._mul(c, A));
        //_add: Jacobi -> Jacobi
        // Convert to Affine Co-ordinates
        ECCMath_noconflict.toZ1(LHS, p);
        ECCMath_noconflict.toZ1(RHS, p);
        // Verify. Do they match?
        if(RHS[0] == LHS[0] &&
           RHS[1] == LHS[1]) {
            return true;
        } else {
                return false;
            }
    }

    //Eason:check the proofs in the contract
    function easyVerifyProofs() public returns (bool result) { 

        uint challenge = 0;
        uint[3][ ] memory Ts = new uint[3][](proofs.length);
        uint[2][ ] memory As = new uint[2][](proofs.length);
        
        PoK memory pf;
        for(uint i=0; i<proofs.length; i++){
            pf = proofs[i];
            if(!verifySchnorr(pf.g, pf.A, /*pf.message,*/ pf.T, pf.c, pf.s)) {
                emit Fail(i);
                return false;
            }

            challenge = addmod(pf.c, challenge, q);
            As[i] = pf.A;
            Ts[i] = pf.T;
        }
        pf = proofs[0];
        if (!(challenge == uint(keccak256(pf.g, As, pf.message, Ts)) % q)) return false;//Check the message
        return true;
    }
    /*function test(uint pokerKey, uint victim) public view  returns(bool, uint, uint[2], uint[2], uint, uint[3], uint, uint){
        bool result = verifyProofs(prove(pokerKey, G, [hand[0],hand[1]], victim));
        
        return (result,prove(pokerKey, G, [hand[0],hand[1]], victim)) ;
    }*/

    function testSchnorr(uint pokerKey, uint[2] werewolf, uint[2] liveHand, uint victim) public view returns(bool result, uint[2] _G, uint[2] A, uint message, uint[3] T, uint c, uint s){
        //test "real" also "fake" proof
        if(werewolf[0]==0 && werewolf[1]==0 && liveHand[0]==0 && liveHand[1]==0){
            (werewolf[0],werewolf[1]) = (G[0],G[1]);
            (liveHand[0],liveHand[1]) = (problems[0][0], problems[0][1]);
        }
        require(werewolf[0]!=0 && werewolf[1]!=0 && liveHand[0]!=0 && liveHand[1]!=0);
        //message = victim;
        if(pokerKey != 0){
            //uint secret = pokerKey;
            (_G, A, message,T,c,s) = createSchnorr(pokerKey, werewolf, liveHand, victim, 0 ,0 );
        }else{
            (_G, A, message,T,c,s) = forgeProof(werewolf, liveHand, victim);
        }
        result=verifySchnorr(_G, A, /*message,*/ T,c,s);
    }

    struct PoK{
        uint[2] g; 
        uint[2] A; 
        uint message; 
        uint[3] T; 
        uint c; 
        uint s;
    }
    
    event Fail(uint pf);
    event Process(uint pf);
    //event parameter needs a name @@
    //https://github.com/trufflesuite/truffle/issues/494

    /* TODO
    struct BetaPoK{
        Problem problem; 
        //uint[2] g; 
        //uint[2] A; 
        uint message; 
        Signature signature;
        //uint[3] T; 
        //uint c; 
        //uint s;
    }

    struct Problem{
        uint[2] g; 
        uint[2] A;
    }

    struct Signature{
        uint[3] T; 
        uint c; 
        uint s;
    }*/
}
