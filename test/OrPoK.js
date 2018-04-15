'use strict'
const PoKContract = artifacts.require("./OrPoK.sol")
const myBigNumber = require('BigNumber.js')
myBigNumber.config({ MODULO_MODE: myBigNumber.EUCLID })

contract('OrPoK', async(accounts) => {
    const admin = accounts[0]
    var testPoK, abi, message, real, q
    var secrets = [10,5531555551234,3, 44333,3443]
    var pfs = []
    function print(pf){
        
        let c = pf.c
        console.log("c= "+c.toString(16))
    }
    before( async ()=> {     

        testPoK = await PoKContract.new({from: admin})
        q = await testPoK.q()
        console.log("q= "+q.toString(16))

    })
    
    it("at begining generate discrete log problem",async function(){
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
        
        function writeTo(proof, pf){
            pf.g = proof[0]
            pf.A = proof[1]
            pf.message = proof[2]
            pf.T = proof[3]
            pf.c = proof[4]
            pf.s = proof[5]
        }

        console.log("Genarating proof...")
        let pokerKey = secrets[real]
        let victim = message

        // try to call createProof many times
        //function createProofs(uint pokerKey = secret,  uint victim = message, uint real) public returns(PoK[] pfs){            
        let totalFakeC = new myBigNumber(0);
        let Ts = []
        // m-1 "fake" proof
        let i=0;            
        for(i=0; i<real; i++){
            
            pfs[i] = {g:[],A:[],message:0,T:[],c:0,s:0}
            let proof = await testPoK.easyForgeProof(i,victim)
            writeTo(proof, pfs[i])
            console.log("proof "+i)

            Ts[i] = pfs[i].T
            print(pfs[i])
            totalFakeC = totalFakeC.plus(pfs[i].c).modulo(q);
            console.log("totalFakeC = ", totalFakeC.toString(16)) 

        }
                        
        for( i=real+1; i<secrets.length; i++){
            
            pfs[i] = {g:[],A:[],message:0,T:[],c:0,s:0}
            let proof = await testPoK.easyForgeProof(i,victim)       
            writeTo(proof, pfs[i])
            console.log("proof "+i)

            Ts[i] = pfs[i].T
            
            print(pfs[i])
            totalFakeC = totalFakeC.plus(pfs[i].c).modulo(q);
            console.log("totalFakeC = ", totalFakeC.toString(16)) 
        }
        
        //1 real proof
        let realt = await testPoK.easyComputeRealt(pokerKey, victim, real)
        Ts[real] = await testPoK.computeTFrom(realt)
        let realChallenge = new myBigNumber(await testPoK.easyComputeChallenge(victim, real, Ts))
        //web3 use deafult bignumber.js, mod may < 0. Use self config instead
        console.log("realChallenge =",realChallenge.toString(16))
        let realc = realChallenge.minus(totalFakeC).modulo(q)
        console.log("realc = (realChallenge - totalFakeC) mod q =", realc.toString(16))


        pfs[real] = {g:[],A:[],message:0,T:[],c:0,s:0}
        let proof = await testPoK.easyCreateSchnorr(real, pokerKey, victim,  realt ,realc)       
        writeTo(proof, pfs[real])
        console.log("proof "+real)
        print(pfs[real])
                 
    })

    it("then verify proofs",async function(){
        let victim = pfs[0].message
        let Ts = []
        let cTotal = new myBigNumber(0);
        let i = 0
        for(i=0; i<secrets.length; i++){    
            let proof = pfs[i]
            console.log("proof "+i+":")
            let result = await testPoK.verifySchnorr(proof.g,proof.A,proof.T,proof.c,proof.s)
            console.log(result)
            Ts[i] = pfs[i].T
            print(pfs[i])
            cTotal = cTotal.plus(pfs[i].c).modulo(q);
            console.log("cTotal= "+cTotal.toString(16)) 
        }
        console.log("so cTotal is"+cTotal.toString(16))
        let realChallenge = new myBigNumber(await testPoK.easyComputeChallenge(victim, real, Ts))
        console.log("realChallenge ="+realChallenge.toString(16))
        let realc = realChallenge.minus(pfs[1].c).modulo(q)
        assert(cTotal.equals(realChallenge),"Message is wrong!")
    })

    /*it("create proofs",async function(){
        var PoK = await testPoK.createProofs(secrets[1], message, 1,{from: admin})
            //console.log(PoK[0])
            web3.eth.getBlock('latest')
    })*/

    after(  ()=> {     

        console.log("get contract informations ... ")
        console.log("address=\""+testPoK.address+"\"")
        console.log("abi="+JSON.stringify(testPoK.abi))

    })

    

})
