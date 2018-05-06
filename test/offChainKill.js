'use strict'
const PoK = artifacts.require("./OrPoK.sol")
const Werewolf = artifacts.require("./SmartWerewolf.sol")
const myBigNumber = require('BigNumber.js')
myBigNumber.config({ MODULO_MODE: myBigNumber.EUCLID })
const fs = require('fs')
const readline = require('readline')
const getLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

contract('SmartWerewolf', function(accounts) {
    //on-chain data
    var werewolf, order
    const admin = accounts[0]
    const user1 = accounts[1]
    const user2 = accounts[2]
    const user3 = accounts[3]
    const user4 = accounts[4]
    const user5 = accounts[5]
    const user6 = accounts[6]
    const user7 = accounts[7]
    const user8 = accounts[8]
    //public data ( in players ); off-chain state
    var players, me, werewolfCard,  n, numSurvive
    var initialHands = []
    var hands = []
    var pfs = []
    //secret data ( in players )
    var pokerKeys = [0, 0xabc,0xa55bf4, 0xa, 0x80c03,0x3443, 0x255]
    
    async function prepareHands( ){
        let i=1; 
        for(i=1; i<= n; i++){
            console.log("Player",i,"is shuffling the deck ...")
            await werewolf.shuffleCardBy(i, pokerKeys[i],{from: admin})//v
        }
            
        let initialHands = []
        for (i=1; i<=n; i++){
            initialHands[i] = await werewolf.dealCardTo(i)
            console.log("\nDeal card")
            console.log(initialHands[i][0].toString(16),initialHands[i][1].toString(16))
            console.log("to player",i)
        }
        let j=1
        for(i=1; i<=n; i++){
            console.log("\nPlayer",i,"recover her card")
            for(j=1;j<=n;j++){
                console.log("\twith Player",j,"\'s help")
                let decrptHand = await werewolf.helpDecryptRole(j, pokerKeys[j], i, initialHands[i])//V
                initialHands[i][0] = decrptHand[0]
                initialHands[i][1] = decrptHand[1]
                console.log("==>",initialHands[i][0].toString(16),initialHands[i][1].toString(16))
            }
        }
        let out = fs.createWriteStream('initialHands.txt', {
            encoding: 'utf8'
        })
            
        for(i=1; i<=n; i++){
            out.write(initialHands[i][0].toString(16)+','+initialHands[i][1].toString(16)+'\n')
        }
        out.end()
    }
    
    function passHandsToPoK(hands, numHands){
        let pokProblems = []
        let i = 0
        for(i=0; i< numHands; i++){
            pokProblems[i] = hands[i+1]
        }
        return pokProblems
    }

    //TODO: remove on-chain read
    const getSurviveHands = async function(num,w) {
        let hands = []
        for(var i=1; i<=num; i++){
            let name = await w.livingPlayers(i)
            let hand = await w.getHandOf(name)
            console.log(i,hand[0].toString(16),hand[1].toString(16))
            hands[i] = hand
        }
        return hands
    }

    const generateZKProof = function () {
        // generate zk here
        return 123
    }

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
        werewolf = await Werewolf.deployed()
        order = await werewolf.cardOrder()//(read from chain only 1 time)
    })
    

    it("is day 0",async function(){//Prepare the game
        players = [user1, user2, user3, user4, user5, user6]
        n = players.length
        await werewolf.engagement([user1, user2, user3, user4, user5, user6], {from: admin})
        await werewolf.createCards({from: admin})
        werewolfCard = await werewolf.werewolfCard()// TODO: no on-chain read
        console.log("easy shuffle...")
        //await prepareHands()
        /* try to stop here 
        await getLine.question("How are you? ", function(answer) {
            console.log("Bye", answer);
            getLine.close();
        });*/
        var stringHands
        fs.readFile('initialHands.txt','utf8', (err,data)=>{
            stringHands =data
            let start = 0
            let i =1
            for(i = 1; i<=n; i++){
                console.log('deal card to',i)
                let camma = stringHands.indexOf(',',start)
                let endline = stringHands.indexOf('\n',start)
                let x = new myBigNumber(stringHands.substring(start, camma),16)
                let y = new myBigNumber(stringHands.substring(camma +1, endline), 16)
                hands[i] = [x,y]
                start = endline + 1
                }      
        })
       
    })

    it("can kill at night",async function(){
        function proofFromArray(arrayProof){
            let pf = {w:[], hand:[], victim: 0, T:[], c: 0, s:0}
            pf.w = arrayProof[0]
            pf.hand = arrayProof[1]
            pf.victim = arrayProof[2]
            pf.T = arrayProof[3]
            pf.c = arrayProof[4]
            pf.s = arrayProof[5]
            return pf
        }

        console.log("It's Night 1 ---")
        //werewolf killing input: hands & pokerKey
        console.log("\tWerewolf genarates proof ...")
        me = 1
        console.log("\t(I am player ",me,",I try to create proof secretly)")
        let pokerKey = pokerKeys[me]
        let numSurvive = await werewolf.numSurvive()// TODO: no on-chain read
        //let hands = await getSurviveHands(numSurvive, werewolf)// TODO: no on-chain read
        let victimNum = 1
        
       
        //prepare real proof
        let totalFakeC = new myBigNumber(0);
        let Ts = []
        // m-1 "fake" proof
        let i = 1           
        for(i=1; i<me; i++){
            pfs[i] = {w:[],hand:[],victim:0,T:[],c:0,s:0}
            let framedHand = hands[i]
            let proofArray = await werewolf.werewolfFrameKilling(framedHand, werewolfCard, victimNum)// TODO: no read on-chain 
            pfs[i] = proofFromArray(proofArray)
            console.log("\n\tproof "+i+" = Prove I am player "+i+" and I am werewolf !")

            Ts[i] = pfs[i].T
            //print(pfs[i])
            totalFakeC = totalFakeC.plus(pfs[i].c).modulo(order);
        }
                       
        for( i=me+1; i<=numSurvive; i++){
            
            pfs[i] = {w:[],hand:[],victim:0,T:[],c:0,s:0}
            let framedHand = hands[i]
            let proofArray = await werewolf.werewolfFrameKilling(framedHand, werewolfCard, victimNum)
            pfs[i] = proofFromArray(proofArray)
            console.log("\n\tproof "+i+" = Prove I am player "+i+" and I am werewolf !")

            Ts[i] = pfs[i].T
            totalFakeC = totalFakeC.plus(pfs[i].c).modulo(order);
        }
        //1 real proof
        let pokHands = passHandsToPoK(hands, numSurvive)
        let realt = await werewolf.werewolfChooset(pokerKey, pokHands, werewolfCard, victimNum)
        Ts[me] = await werewolf.werewolfComputeT(realt,werewolfCard)
        let realChallenge = new myBigNumber(await werewolf.computeChallenge(werewolfCard, pokHands, victimNum, Ts))
        let realc = realChallenge.minus(totalFakeC).modulo(order)
        
        pfs[me] = {w:[],hand:[], victim:0,T:[],c:0,s:0}
        let proofArray = await werewolf.werewolfProve(pokerKey, werewolfCard, hands[me], victimNum,  realt ,realc)      
        pfs[me] = proofFromArray(proofArray)
        
        console.log("\n\tproof "+me+" = Prove I am player "+me+" and I am werewolf !")
        let publishMessage = "0x"+pfs[me].victim.toString(16)
    })

    it("then verify proofs",async function(){
        //console.log("I want to prove I am werewolf, and I am one of the alive players ----- hash -----> challenge",realChallenge.toString(16))
        let victimNum = pfs[1].victim
        let Ts = []
        let cTotal = new myBigNumber(0);
        let i = 1
        
        let numSurvive = await werewolf.numSurvive()// TODO: no on-chain read
        let pokHands = passHandsToPoK(hands, numSurvive)
        for(i=1; i<= numSurvive; i++){    
            let proof = pfs[i]
            console.log("\tverify proof "+i+":")
            let result = await werewolf.verifyWerewolfProof(proof.w,proof.hand,proof.T,proof.c,proof.s)
            console.log("\t\t"+result)
            if(result == true) console.log("\t\tMaybe he is player "+i+" and he is werewolf ")
            else console.log("\t\the is not player "+i+" Or he is not werewolf")
            Ts[i] = pfs[i].T
            print(pfs[i])
            cTotal = cTotal.plus(pfs[i].c).modulo(order);
        }
        let realChallenge = new myBigNumber(await werewolf.computeChallenge(werewolfCard, pokHands, victimNum,Ts))
        console.log("\tVerify signature and message :",cTotal.equals(realChallenge))

    })

    after(  async ()=> {     
        //console.log("get contract informations ... ")
        //console.log("address=\""+werewolf.address+"\"")
        //console.log("abi="+JSON.stringify(werewolf.abi))

    })
  
})