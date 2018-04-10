'use strict'
const testZKProof = artifacts.require("./SmartWerewolf.sol")

contract('ZKProof', async(accounts) => {
    const admin = accounts[0]
    var testZKP, proofOfSignature, message, secret
    before( async ()=> {        
        testZKP = await testZKProof.new({from: admin})
    })
    
    it("create proof",async function(){
            let m='hello world'
            message = web3.fromAscii(m)
            secret=45678
            console.log('\tinput')
            console.log('\t\tmessage: ',m)
            console.log('\t\tsecret: ',secret)
            proofOfSignature = await testZKP.createProof(secret,message, {from: admin})
            let pb_x=proofOfSignature[0][0].toString(16)
            let pb_y=proofOfSignature[0][1].toString(16)
            let s=proofOfSignature[1].toString(16)
            let e=proofOfSignature[2].toString(16)
            console.log('\toutput\n\t\tpubkey:\n\t\t\tx=', pb_x,'\n\t\t\ty=', pb_y)
            console.log('\t\tproofOfSignature')
            console.log('\t\t\ts: ',s)
            console.log('\t\t\te: ',e)
        })

    it("accept correct proof", async function() {
        let success = await testZKP.verifyProof(proofOfSignature[0],message,proofOfSignature[1],
            proofOfSignature[2],{from: admin})
        assert(success==true)
    })

    it("reject reused proof", async function() {
        let m='bye'
        message=web3.fromAscii(m)
        console.log('\tReuse the same proof for new message: ',m)
        let success = await testZKP.verifyProof(proofOfSignature[0],message,proofOfSignature[1],
            proofOfSignature[2],{from: admin})
        assert(success==false)
    })

})
