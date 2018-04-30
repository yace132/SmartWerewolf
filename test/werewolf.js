'use strict'
const PoK = artifacts.require("./OrPoK.sol")
const Werewolf = artifacts.require("./SmartWerewolf.sol")
const myBigNumber = require('BigNumber.js')
myBigNumber.config({ MODULO_MODE: myBigNumber.EUCLID })
//run truffle migration
contract('SmartWerewolf', function(accounts) {
    const admin = accounts[0]
    const user1 = accounts[1]
    const user2 = accounts[2]
    const user3 = accounts[3]
    const user4 = accounts[4]
    const user5 = accounts[5]
    const user6 = accounts[6]
    var pok, werewolf, abi, me, order
    var pokerKeys = [0xa,0xa55bf4,0xbb3, 0x80c03,0x3443, 0x255]
    var pfs = []

    const generateZKProof = function () {
        // generate zk here
        return 123
    }

    //on-chain state (read from chain)
    //We need off-chain state avoid writing to block chain
    //TODO: change to off-chain
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

    function passHandsToPoK(hands, numHands){
        let pokProblems = []
        let i = 1
        for(i=1; i<= numHands; i++){
            pokProblems[i] = hands[i]
            console.log("in pass hand",pokProblems[i][0].toString(16))
        }
        return pokProblems
    }

    before( async ()=> {     
        pok = await PoK.new({from: admin})
        werewolf = await Werewolf.new(pok.address, {from: admin})
        order = await werewolf.cardOrder()//(read from chain only 1 time)
    })
    
    /*it("pass Werewolves' victory", async function() {
        
        //day 0 (Prepare the game)
        await werewolf.engagement([user1, user2, user3, user4, user5, user6], {from: admin})
        await werewolf.createCards({from: admin})
        await werewolf.shuffleCards({from: admin})
        await werewolf.dealCards({from: admin})
        await GetSurviveHands(werewolf)
        console.log("It's Night 1 ---")
        
        var proofCanKill = generateZKProof()
        var victimName = user1 // should be satisfied to the proofCanKill proof
        await werewolf.nightKill(victimName, proofCanKill, {from: admin})
        await werewolf.openRole(3, 456, {from: user1})
        await GetSurviveHands(werewolf)
        console.log("\nIt's Day 1   ---")
        await werewolf.dayVoting(user2)
        await werewolf.openRole(1, 456, {from: user2})
        await GetSurviveHands(werewolf)
        console.log("\nIt's Night 2 ---")
        proofCanKill = generateZKProof()
        victimName = user3
        await werewolf.nightKill(victimName, proofCanKill, {from: admin})
        await werewolf.openRole(2, 456, {from: user3})
        await GetSurviveHands(werewolf)
        var w = await werewolf.winner();//需要等getter function, enum 只能用數字確認
        assert.equal(w, 0, "Winner wasn't determined at that time.")
        
        console.log("\nIt's Day 2   ---")
        await werewolf.dayVoting(user4)
        await werewolf.openRole(3, 456, {from: user4})
        w = await werewolf.winner()
        assert.equal(w,"Werewolves","Winner shold be Werewolves.")
        console.log(w,"win");
        await GetSurviveHands(werewolf)
    })*/

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
        //day 0 (Prepare the game)
        await werewolf.engagement([user1, user2, user3, user4, user5, user6], {from: admin})
        await werewolf.createCards({from: admin})
        let werewolfCard = await werewolf.werewolfCard()// TODO: no on-chain read
        await werewolf.shuffleCards({from: admin})
        await werewolf.dealCards({from: admin})
        console.log("It's Night 1 ---")
        
        //werewolf killing input: hands & pokerKey
        console.log("\tWerewolf genarates proof ...")
        me = 3
        let pokerKey = pokerKeys[me]
        let numSurvive = await werewolf.numSurvive()// TODO: no on-chain read
        let hands = await getSurviveHands(numSurvive, werewolf)// TODO: no on-chain read
        let victimNum = 1
        
       
        //prepare real proof
        let totalFakeC = new myBigNumber(0);
        let Ts = []
        // m-1 "fake" proof
        let i=1;            
        for(i=1; i<me; i++){
            pfs[i] = {w:[],hand:[],victim:0,T:[],c:0,s:0}
            let framedHand = hands[i]
            let proofArray = await werewolf.werewolfFrameKilling(framedHand, werewolfCard, victimNum)// TODO: no read on-chain 
            pfs[i] = proofFromArray(proofArray)
            console.log("\n\tproof "+i+" = Prove I am player "+i+" and I am werwolf !")

            Ts[i] = pfs[i].T
            print(pfs[i])
            totalFakeC = totalFakeC.plus(pfs[i].c).modulo(order);
        }
                       
        for( i=me+1; i<=numSurvive; i++){
            
            pfs[i] = {w:[],hand:[],victim:0,T:[],c:0,s:0}
            let framedHand = hands[i]
            console.log("frame", hands[i], framedHand[1].toString(16))
            let proofArray = await werewolf.werewolfFrameKilling(framedHand, werewolfCard, victimNum)
            pfs[i] = proofFromArray(proofArray)
            console.log("\n\tproof "+i+" = Prove I am player "+i+" and I am werwolf !")

            Ts[i] = pfs[i].T
            print(pfs[i])
            totalFakeC = totalFakeC.plus(pfs[i].c).modulo(order);
        }
        //1 real proof
        let pokHands = passHandsToPoK(hands, numSurvive)
        let realt = await werewolf.werewolfChooset(pokerKey, pokHands, werewolfCard, victimNum)
        console.log("realt",realt)
        Ts[me] = await werewolf.werewolfComputeT(realt,werewolfCard)
        let realChallenge = new myBigNumber(await werewolf.computeChallenge(werewolfCard, pokHands, victimNum, me, Ts))
        let realc = realChallenge.minus(totalFakeC).modulo(order)
        
        pfs[me] = {w:[],hand:[], victim:0,T:[],c:0,s:0}
        //let proof = await werewolf.werewolfProve(pokerKeys[me], werewolfCard, hands[me], victimNum,  realt ,realc)      
        /*writeTo(proof, pfs[real])
        console.log("\n\tproof "+real+" = Prove I am player "+real+" and I am werwolf !")
        print(pfs[real])
        let publishMessage = "0x"+pfs[real].message.toString(16)
        console.log("\n\tmessage = "+web3.toAscii(publishMessage))*/
            })
    /*it("pass Humans' victory", async function() {
        let werewolf = await Werewolf.new({from: admin})
        
        //day 0 (Prepare the game)
        await werewolf.engagement([user1, user2, user3, user4, user5, user6], {from: admin})
        await werewolf.createCards({from: admin})
        await werewolf.shuffleCards({from: admin})
        await werewolf.dealCards({from: admin})
        
        console.log("It's Night 1 ---")
        var proofCanKill = generateZKProof()
        var victimName = user1 // should be satisfied to the proofCanKill proof
        await werewolf.nightKill(victimName, proofCanKill, {from: admin})
        await werewolf.openRole(3, 456, {from: user1})
        
        console.log("\nIt's Day 1   ---")
        await werewolf.dayVoting(user2)
        await werewolf.openRole(1, 456, {from: user2})
        
        console.log("\nIt's Night 2 ---")
        proofCanKill = generateZKProof()
        victimName = user3
        await werewolf.nightKill(victimName, proofCanKill, {from: admin})
        await werewolf.openRole(2, 456, {from: user3})
        var w = await werewolf.winner();//需要等getter function, enum 只能用數字確認
        assert.equal(w, 0, "Winner wasn't determined at that time.")
        
        console.log("\nIt's Day 2   ---")
        await werewolf.dayVoting(user4)
        await werewolf.openRole(1, 456, {from: user4})
        w = await werewolf.winner()
        assert.equal(w,"Humans","Winner shold be Werewolves.")
        console.log(w,"win");
        //await GetSurviveHands(werewolf)
    })

    it("can collect hands ", async function() {
        let werewolf = await Werewolf.new({from: admin})
        console.log("at:", werewolf.address)
        //day 0 (Prepare the game)
        await werewolf.engagement([user1, user2, user3, user4, user5, user6], {from: admin})
        await werewolf.createCards({from: admin})
        await werewolf.shuffleCards({from: admin})
        await werewolf.dealCards({from: admin})
        
        var i
        
        console.log("Start! live players' :")
        
        //await GetSurviveHands(werewolf)
       

        console.log("It's Night 1 ---")
        

        var proofCanKill = generateZKProof()
        var victimName = user1 // should be satisfied to the proofCanKill proof
        await werewolf.nightKill(victimName, proofCanKill, {from: admin})
        await werewolf.openRole(3, 456, {from: user1})
        
        //await GetSurviveHands(werewolf)

        console.log("\nIt's Day 1   ---")
        await werewolf.dayVoting(user2)
        await werewolf.openRole(1, 456, {from: user2})

        //await GetSurviveHands(werewolf)
        
        console.log("\nIt's Night 2 ---")
        proofCanKill = generateZKProof()
        victimName = user3
        await werewolf.nightKill(victimName, proofCanKill, {from: admin})
        await werewolf.openRole(2, 456, {from: user3})
        var w = await werewolf.winner();//需要等getter function, enum 只能用數字確認
        assert.equal(w, 0, "Winner wasn't determined at that time.")
        
        //await GetSurviveHands(werewolf)

        console.log("\nIt's Day 2   ---")
        await werewolf.dayVoting(user4)
        await werewolf.openRole(3, 456, {from: user4})
        //await GetSurviveHands(werewolf)

        w = await werewolf.winner()
        assert.equal(w,"Werewolves","Winner shold be Werewolves.")
        console.log(w,"win");

       
        
    })*/

    /*after(  ()=> {     

        console.log("get contract informations ... ")
        console.log("address=\""+werewolf.address+"\"")
        console.log("abi="+JSON.stringify(werewolf.abi))

    })*/
  
})