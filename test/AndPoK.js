'use strict'
const PoKContract = artifacts.require("./AndPoK.sol")

contract('AndPoK', async(accounts) => {
    const admin = accounts[0]
    var testPoK, proofOfSignature, message, secret
    before( async ()=> {        
        testPoK = await PoKContract.new({from: admin})
    })
    
    it("create proof",async function(){
            let m='hello world'
            message = web3.fromAscii(m)
            secret=45678
            console.log('\tinput')
            console.log('\t\tmessage: ',m)
            console.log('\t\tsecret: ',secret)
            proofOfSignature = await testPoK.prove(secret,message,{from: admin})
            let A =[proofOfSignature[0][0].toString(16),proofOfSignature[0][1].toString(16)]
            let B =[proofOfSignature[1][0].toString(16),proofOfSignature[1][1].toString(16)]
            let getM = proofOfSignature[2]
            let T1 =[proofOfSignature[3][0].toString(16),proofOfSignature[3][1].toString(16)]
            let T2 =[proofOfSignature[4][0].toString(16),proofOfSignature[4][1].toString(16)]
            let c=proofOfSignature[5].toString(16)
            let s=proofOfSignature[6].toString(16)
            console.log('\toutput\n\t\tpubkey:\n\t\t\tx=',A[0],'\n\t\t\ty=', A[1])
            console.log('\t\tproofOfSignature')
            console.log('\t\t\tc: ',c)
            console.log('\t\t\ts: ',s)
        })

    /*it("accept correct proof", async function() {
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
    })*/

})
