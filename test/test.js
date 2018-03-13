'use strict'
const Werewolf = artifacts.require("./SmartWerewolf.sol")

contract('SmartWerewolf', function(accounts) {
    const admin = accounts[0]
    const user1 = accounts[1]
    const user2 = accounts[2]
    const user3 = accounts[3]
    const user4 = accounts[4]
    const user5 = accounts[5]
    const user6 = accounts[6]

    const generateZKProof = function () {
        // generate zk here
        return 123
    }
 
    it("go through the process", async function() {
        var werewolf = await Werewolf.new({from: admin})
        await werewolf.engagement([user1, user2, user3, user4, user5, user6], {from: admin})
        await werewolf.createCards({from: admin})
        await werewolf.shuffleCards({from: admin})
        await werewolf.dealCards({from: admin})
        var proofCanKill = generateZKProof()
        var victimName = user1 // should be satisfied to the proofCanKill proof
        await werewolf.nightKill(victimName, proofCanKill, {from: admin})
        await werewolf.dayVoting(user2)
        proofCanKill = generateZKProof()
        victimName = user3 
        await werewolf.nightKill(victimName, proofCanKill, {from: admin})
        await werewolf.openRole(1, 123)
    })

    it("anther test process if needed", async function() {

    })
})
