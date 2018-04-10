'use strict'
const PoKContract = artifacts.require("./OrPoK.sol")

contract('OrPoK', async(accounts) => {
    const admin = accounts[0]
    var testPoK, abi, message, real
    var secrets = [10,3,400]
    before( async ()=> {     

        testPoK = await PoKContract.new({from: admin})

    })
    
    it("generate discrete log problem",async function(){
            let m='hello world'
            
            message = web3.fromAscii(m)
            real =0
            console.log('\tmessage: ',m)
            console.log('\tsecret: ',secrets)
            
            await testPoK.setProblems(secrets,{from: admin})
            
            for(let i = 0; i< secrets.length; i++){
                let problem = await testPoK.getProblems(i)
                console.log("Q_"+i+"\n "+[problem[0].toString(16),problem[1].toString(16)])
            }
            
            
        })
    it("create proof",async function(){
        console.log("Genarating proof...")
                let pokerKey = secrets[real]
                let victim = message

                // try to call createProof many times
                //function createProofs(uint pokerKey = secret,  uint victim = message, uint real) public returns(PoK[] pfs){
                    let pfs = []
                    let totalFakeC = 0;
                    let Ts = []

                    // m-1 "fake" proof
                    let i=0;
                    
                    
                    

                    for(i=0; i<real; i++){
                        pfs[i] = {g:[],A:[],message:0,T:[],c:0,s:0}
                        let pf = pfs[i]
                        //[pfs[i].g, pfs[i].A, pfs[i].message,pfs[i].T, pfs[i].c, pfs[i].s] 
                        let proof = await testPoK.easyForgeProof(i,victim)
                        
                        /*pf.g = proof[0]
                        pf.A = proof[1]
                        pf.message = proof[2]
                        pf.T = proof[3]
                        pf.c = proof[4]
                        pf.s = proof[5]*/
                        console.log("proof "+i)
                        /*console.log("Tx",pf.T[0].toString(16))
                        console.log("Ty",pf.T[1].toString(16))*/
                        let result = await testPoK.verifyProof(proof[0],proof[1],proof[3],proof[4],proof[5])
                        console.log(result)
                        Ts[i] = pf.T
                        //totalFakeC = addmod(totalFakeC, pf.c, q); 
                        }
                        
                    for( i=real+1; i<secrets.length; i++){
                       pfs[i] = {g:[],A:[],message:0,T:[],c:0,s:0}
                        let pf = pfs[i]
                        //[pfs[i].g, pfs[i].A, pfs[i].message,pfs[i].T, pfs[i].c, pfs[i].s] 
                        let proof = await testPoK.easyForgeProof(i,victim)
                        
                        /*pf.g = proof[0]
                        pf.A = proof[1]
                        pf.message = proof[2]
                        pf.T = proof[3]
                        pf.c = proof[4]
                        pf.s = proof[5]*/
                        console.log("proof "+i)
                        /*console.log("Tx",pf.T[0].toString(16))
                        console.log("Ty",pf.T[1].toString(16))*/
                        let result = await testPoK.verifyProof(proof[0],proof[1],proof[3],proof[4],proof[5])
                        console.log(result)
                        Ts[i] = pf.T
                        //totalFakeC = addmod(totalFakeC, pf.c, q); 
                    }
                    /*
                    emit Process(real);
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
                    (pf.g, pf.A, pf.message,) = createProof(pokerKey,G,problems[real],victim, realT, realc);
                    (, pf.T, pf.c, pf.s) = createProof(pokerKey,G,problems[real],victim,realT,realc);
                }*/




                
                /*var PoK = await testPoK.createProofs(secrets[1], message, 1,{from: admin})
                console.log(PoK[0])
                web3.eth.getBlock('latest')*/
                /*await testPoK.publishProofs(secrets[1], message, 1,{from: admin})
                let G = await testPoK.proofs(0)
                let Gx = G[0].toString(16)
                
                console.log("G.x",Gx)
                
                
                /*var result 
                result= await testPoK.verifyProofs({from: admin})
                console.log(result)
                assert(result == true,"Protocol not ok")*/
                //console.log(result)
            })


    after(  ()=> {     

        /*console.log("get contract informations ... ")
        console.log("address=\""+testPoK.address+"\"")
        console.log("abi="+JSON.stringify(testPoK.abi))*/

    })

    

})
