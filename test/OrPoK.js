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
            let m='kill player 0'
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

    /*it("create proofs",async function(){
        var PoK = await testPoK.createProofs(secrets[1], message, 1)
        //console.log(PoK[0])
        //web3.eth.getBlock('latest')
    })//view tx is limited by gas 
    //https://ethereum.stackexchange.com/questions/33562/truffle-constant-functions-run-out-of-gas-how-to-simulate-a-local-node?rq=1 
    */
    
    it("can kill at night",async function(){
        
        function writeTo(proof, pf){
            pf.g = proof[0]
            pf.A = proof[1]
            pf.message = proof[2]
            pf.T = proof[3]
            pf.c = proof[4]
            pf.s = proof[5]
        }

        console.log("\n\t( Werewolf genarates proof ... )")
        let pokerKey = secrets[real]
        let victim = message

        // try to call createProof many times
        //function createProofs(uint pokerKey = secret,  uint victim = message, uint real) public returns(PoK[] pfs){            
        let totalFakeC = new myBigNumber(0);
        let Ts = []
        // m-1 "fake" proof
        let i=0;            
        for(i=0; i<real; i++){
            console.log("\t\t( Werewolf forge proof of player",i,"... )")
            pfs[i] = {g:[],A:[],message:0,T:[],c:0,s:0}
            let proof = await testPoK.easyForgeProof(i,victim)
            writeTo(proof, pfs[i])
            
            Ts[i] = pfs[i].T
            totalFakeC = totalFakeC.plus(pfs[i].c).modulo(q);
            
        }
                        
        for( i=real+1; i<secrets.length; i++){
            console.log("\t\t( Werewolf forge proof of player",i,"... )")
            pfs[i] = {g:[],A:[],message:0,T:[],c:0,s:0}
            let proof = await testPoK.easyForgeProof(i,victim)       
            writeTo(proof, pfs[i])
            
            Ts[i] = pfs[i].T
            
            totalFakeC = totalFakeC.plus(pfs[i].c).modulo(q);
        }
        
        //1 real proof
        console.log("\t\t( Werewolf creates proof of him(player",real+") ... )")
        let realt = await testPoK.easyComputeRealt(pokerKey, victim, real)
        Ts[real] = await testPoK.easyComputeTFrom(realt)
        let realChallenge = new myBigNumber(await testPoK.easyComputeChallenge(victim,  Ts))
        //web3 use deafult bignumber.js, mod may < 0. Use self config instead
        //debug console.log("realChallenge =",realChallenge.toString(16))
        let realc = realChallenge.minus(totalFakeC).modulo(q)
        

        pfs[real] = {g:[],A:[],message:0,T:[],c:0,s:0}
        let proof = await testPoK.easyCreateSchnorr(real, pokerKey, victim,  realt ,realc)       
        writeTo(proof, pfs[real])
        
        console.log("\n\t( Werewolf broadcast proof ... )")
        for( i=0; i<secrets.length; i++){
            console.log("\n\tproof "+i+" = Prove I am player "+i+" and I am werewolf !")
            print(pfs[i])
        }
        console.log("proof = proof 0 + proof 1 + proof 2 + proof 3 + proof 4 = Prove I am werewolf, I am one of player 0, player 1, playr 2, player 3, or player 4")
        
        let publishMessage = "0x"+pfs[real].message.toString(16)
        console.log("\n\tmessage = "+web3.toAscii(publishMessage)) 
    })

    it("then verify proofs",async function(){
        //console.log("I want to prove I am werewolf, and I am one of the alive players ----- hash -----> challenge",realChallenge.toString(16))
        let victim = pfs[0].message
        let Ts = []
        let cTotal = new myBigNumber(0);
        let i = 0
        for(i=0; i<secrets.length; i++){    
            let proof = pfs[i]
            console.log("\tverify proof "+i+":")
            let result = await testPoK.verifySchnorr(proof.g,proof.A,proof.T,proof.c,proof.s)
            console.log("\t\t"+result)
            if(result == true) console.log("\t\the is player "+i+" and he is werewolf ")
            else console.log("\t\the is not werewolf "+i+" Or he is werewolf, but player "+i+" is not werewolf")
            Ts[i] = pfs[i].T
            print(pfs[i])
            cTotal = cTotal.plus(pfs[i].c).modulo(q);
        }
        //debug console.log("so cTotal is"+cTotal.toString(16))
        let realChallenge = new myBigNumber(await testPoK.easyComputeChallenge(victim,  Ts))
        //debug console.log("realChallenge ="+realChallenge.toString(16))
        let realc = realChallenge.minus(pfs[1].c).modulo(q)
        console.log("\tVerify signature and message :",cTotal.equals(realChallenge))

    })

    //demo應該更具體一點，去掉抽象的數學，可能可以加偽造證明的情況
    /*it("should reject person who pretend werewolf ",async function(){
        
        function writeTo(proof, pf){
            pf.g = proof[0]
            pf.A = proof[1]
            pf.message = proof[2]
            pf.T = proof[3]
            pf.c = proof[4]
            pf.s = proof[5]
        }

        console.log("\tVillager try to create proof ...")
        //let pokerKey = secrets[real]
        let victim = message

        //let totalFakeC = new myBigNumber(0);
        let Ts = []
        // m-1 "fake" proof
        let i=0;            
        for( i=0; i<secrets.length; i++){
            
            pfs[i] = {g:[],A:[],message:0,T:[],c:0,s:0}
            let proof = await testPoK.easyForgeProof(i,victim)       
            writeTo(proof, pfs[i])
            console.log("\n\tproof "+i+" = Prove I am player "+i+" and I am werewolf !")
            
            Ts[i] = pfs[i].T
            
            print(pfs[i])
            //totalFakeC = totalFakeC.plus(pfs[i].c).modulo(q);
            //debug console.log("totalFakeC = ", totalFakeC.toString(16)) 
        }
        let publishMessage = "0x"+pfs[0].message.toString(16)
        console.log("\n\tmessage = "+web3.toAscii(publishMessage)) 

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
    })*/

    

    /* debug
    after(  ()=> {     

        console.log("get contract informations ... ")
        console.log("address=\""+testPoK.address+"\"")
        console.log("abi="+JSON.stringify(testPoK.abi))

    })
    */
    
})