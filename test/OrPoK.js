'use strict'
const PoKContract = artifacts.require("./OrPoK.sol")
const myBigNumber = require('BigNumber.js')
myBigNumber.config({ MODULO_MODE: myBigNumber.EUCLID })

contract('OrPoK', async(accounts) => {
    const admin = accounts[0]
    var testPoK, abi, message, real, q
    var secrets = [0xa,0xa55bf4,0xbb3, 0x80c03,0x3443]
    var pfs = []
    function print(pf){
        let T = pf.T
        let c = pf.c
        let s = pf.s
        console.log("\t\tT:")
        console.log("\t\t\t"+T[0].toString(16)+",")
        console.log("\t\t\t"+T[1].toString(16)+",")
        console.log("\t\t\t"+T[2].toString(16))
        console.log("\t\tc: "+c.toString(16))
        console.log("\t\ts: "+s.toString(16))
    }
    
    before( async ()=> {     

        testPoK = await PoKContract.new({from: admin})
        q = await testPoK.q()

    })
    
    it("can publish everyone's hand",async function(){
            let m='kill player 3'
            message = web3.fromAscii(m)
            real =2

            
            console.log("\tAssume 5 players left in the game")
            await testPoK.easySetProblems(real,secrets,{from: admin})

            //console.log('\tmessage: ',m)
            console.log("\t           role (secret)\tpokerKey (secret)\t\thand (public)")
            for(let i = 0; i< secrets.length; i++){
                let problem = await testPoK.getProblems(i)
                if(i!=real){
                    console.log("\tplayer "+i+" : villager\t\t"+secrets[i].toString(16)+"\t\t"
                    +[problem[0].toString(16),problem[1].toString(16)[0]+problem[0].toString(16)[1]+problem[0].toString(16)[2]+" ..."])
                }else{
                    console.log("\tplayer "+i+" : werewolf\t\t"+secrets[i].toString(16)+"\t\t"
                    +[problem[0].toString(16),problem[1].toString(16)[0]+problem[0].toString(16)[1]+problem[0].toString(16)[2]+" ..."])
                }
            }   
        })
    
    it("can kill at night",async function(){
        
        function writeTo(proof, pf){
            pf.g = proof[0]
            pf.A = proof[1]
            pf.message = proof[2]
            pf.T = proof[3]
            pf.c = proof[4]
            pf.s = proof[5]
        }

        console.log("\tWerewolf genarates proof ...")
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
            console.log("\n\tproof "+i+" = Prove I am player "+i+" and I am werwolf !")

            Ts[i] = pfs[i].T
            print(pfs[i])
            totalFakeC = totalFakeC.plus(pfs[i].c).modulo(q);
            //debug console.log("totalFakeC = ", totalFakeC.toString(16)) 

        }
                        
        for( i=real+1; i<secrets.length; i++){
            
            pfs[i] = {g:[],A:[],message:0,T:[],c:0,s:0}
            let proof = await testPoK.easyForgeProof(i,victim)       
            writeTo(proof, pfs[i])
            console.log("\n\tproof "+i+" = Prove I am player "+i+" and I am werwolf !")
            
            Ts[i] = pfs[i].T
            
            print(pfs[i])
            totalFakeC = totalFakeC.plus(pfs[i].c).modulo(q);
            //debug console.log("totalFakeC = ", totalFakeC.toString(16)) 
        }
        
        //1 real proof
        let realt = await testPoK.easyComputeRealt(pokerKey, victim, real)
        Ts[real] = await testPoK.computeTFrom(realt)
        let realChallenge = new myBigNumber(await testPoK.easyComputeChallenge(victim, real, Ts))
        //web3 use deafult bignumber.js, mod may < 0. Use self config instead
        //debug console.log("realChallenge =",realChallenge.toString(16))
        let realc = realChallenge.minus(totalFakeC).modulo(q)
        //debug console.log("realc = (realChallenge - totalFakeC) mod q =", realc.toString(16))


        pfs[real] = {g:[],A:[],message:0,T:[],c:0,s:0}
        let proof = await testPoK.easyCreateSchnorr(real, pokerKey, victim,  realt ,realc)       
        writeTo(proof, pfs[real])
        console.log("\n\tproof "+real+" = Prove I am player "+real+" and I am werwolf !")
        print(pfs[real])
        let publishMessage = "0x"+pfs[real].message.toString(16)
        console.log("\n\tmessage = "+web3.toAscii(publishMessage)) 
    })

    it("then verify proofs",async function(){
        let victim = pfs[0].message
        let Ts = []
        let cTotal = new myBigNumber(0);
        let i = 0
        for(i=0; i<secrets.length; i++){    
            let proof = pfs[i]
            console.log("\tproof "+i+":")
            let result = await testPoK.verifySchnorr(proof.g,proof.A,proof.T,proof.c,proof.s)
            console.log("\t\t"+result)
            Ts[i] = pfs[i].T
            //debug print(pfs[i])
            cTotal = cTotal.plus(pfs[i].c).modulo(q);
            //debug console.log("cTotal= "+cTotal.toString(16)) 
        }
        //debug console.log("so cTotal is"+cTotal.toString(16))
        let realChallenge = new myBigNumber(await testPoK.easyComputeChallenge(victim, real, Ts))
        //debug console.log("realChallenge ="+realChallenge.toString(16))
        let realc = realChallenge.minus(pfs[1].c).modulo(q)
        console.log("\tVerify signature and message :",cTotal.equals(realChallenge))

    })

    /*it("create proofs",async function(){
        var PoK = await testPoK.createProofs(secrets[1], message, 1,{from: admin})
            //console.log(PoK[0])
            web3.eth.getBlock('latest')
    })*/

    /* debug
    after(  ()=> {     

        console.log("get contract informations ... ")
        console.log("address=\""+testPoK.address+"\"")
        console.log("abi="+JSON.stringify(testPoK.abi))

    })
    */
    

})
