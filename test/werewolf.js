'use strict'
const Werewolf = artifacts.require("./SmartWerewolf.sol")
//run truffle migration
contract('SmartWerewolf', function(accounts) {
    const admin = accounts[0]
    const user1 = accounts[1]
    const user2 = accounts[2]
    const user3 = accounts[3]
    const user4 = accounts[4]
    const user5 = accounts[5]
    const user6 = accounts[6]
    var werewolf;
    const generateZKProof = function () {
        // generate zk here
        return 123
    }

    //function for test
    const GetSurviveHands = async function(w) {
        let s = await w.numSurvive();// no built-in getter for array length @@
        for(var i=1; i<=s; i++){
            let name = await w.livingPlayers(i)
            let hand = await w.getHandOf(name, {from:admin})
            console.log(i,hand,hand[0],hand[1])
            //let hand = p[2]
            //let hx = hand[0].toString(16)
            //let hy = hand[1].toString(16)                
            //Note: 2 for hand, check https://www.reddit.com/r/ethdev/comments/6us20e/accessing_struct_value_inside_of_map_using_web3/
            //console.log("0x"+hx+hy)//demo
        }

    }

    before( async ()=> {     
        werewolf = await Werewolf.new({from: admin})
    })
    
    it("pass Werewolves' victory", async function() {
        
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
        var w = await werewolf.winner();//需要等getter function, enum 只能用數字確認
        assert.equal(w, 0, "Winner wasn't determined at that time.")
        
        console.log("\nIt's Day 2   ---")
        await werewolf.dayVoting(user4)
        await werewolf.openRole(3, 456, {from: user4})
        w = await werewolf.winner()
        assert.equal(w,"rrrWerewolves","Winner shold be Werewolves.")
        console.log(w,"win");
        await GetSurviveHands(werewolf)
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

    after(  ()=> {     

        console.log("get contract informations ... ")
        console.log("address=\""+werewolf.address+"\"")
        console.log("abi="+JSON.stringify(werewolf.abi))

    })
    
})
