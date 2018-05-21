'use strict'
const PoK = artifacts.require("./OrPoK.sol")
const Werewolf = artifacts.require("./SmartWerewolf.sol")
const myBigNumber = require('BigNumber.js')
myBigNumber.config({ MODULO_MODE: myBigNumber.EUCLID })
const fs = require('fs')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile) 
const readFile = promisify(fs.readFile)
/*
const readline = require('readline');
const getLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
*/


//run truffle migration
contract('SmartWerewolf', function(accounts) {
    const admin = accounts[0]
    const user1 = accounts[1]
    const user2 = accounts[2]
    const user3 = accounts[3]
    const user4 = accounts[4]
    const user5 = accounts[5]
    const user6 = accounts[6]
    var pok, werewolf, abi, me, order, playerNames, numSurvive
    

    
    var werewolfCard
    //Everyone should remember this card for werewolf proof and verify
    
    var players =[]
    //in solidity: MPC
    var deck = []
    var n
    //in solidity: G
    var playerNumOf ={}
    var roleOf = {}
    var deposits = {}
    
    var living = []
    var livingPlayers = []
    var theLivingNumOf = {}
    //in solidty: winner

    var RoleTypes = ["Unseen","Werewolf","  Seer  ","villager"]

    const POINT = {"point":true}
    var pokerKeys = [
        0, 
        0x1e6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36da4e974d162f,
        0x2accc8e4a1235a6d2687f1a7e3ba17bc98c673636790f1b8ad91cc3c05875ef1,
        0x388b70312345bea894b6aeff5a544fb92e78a18e19814cd85dd83b71f772aa6c, 
        0x488c684f0ba1aaaaaa716adb5d21a053ea8e90277d0868337229f97bede61418,
        0x559cbb0e2411bbbbbb3778987b1e22153c086a95e00018bdf89de078917abc63, 
        0x62d052c865f5763aad42add43856927612345678a00062d36b2bae914d58b8c8]
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

    //off-chain version
    const quickGetSurviveHands = function() {
        let hands = []
        for(let i=1; i<=n; i++){
            let name = livingPlayers[i]
            let hand = quickGetHandOf(name)
            hands[i] = hand
        }
        return hands
    }

    function quickGetHandOf(name){
        let num = playerNumOf[name]
        let player = players[num]
        return player.hand
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
        let i = 0
        for(i=0; i< numHands; i++){
            pokProblems[i] = hands[i+1]
        }
        return pokProblems
    }

    async function prepareHands( ){
        console.log("need update")
        /*
        let i=1; 
            for(i=1; i<= n; i++){
                console.log("Player",i,"is shuffling the deck ...")
                await werewolf.shuffleCardBy(i, pokerKeys[i],{from: admin})
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
            */
        }

    async function searchLog(keywordEvent){
        return new Promise(function (resolve, reject){
            keywordEvent.watch(function(err,event){
                if(err){
                    reject(err)
                }else{
                    resolve(event.args)
                } 
            })
        })
    }

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

    function str(objBN,tag){
        let stringBN
        let result
        if(tag["point"]){
            result = [str(objBN[0],{}),str(objBN[1],{})]
        }else{        
            if(objBN <=100){
                stringBN = objBN.toString(10)
                result = stringBN
            }else{
                stringBN = objBN.toString(16)
                result = "0x"+stringBN[0]+stringBN[1]+stringBN[2]+stringBN[3]+stringBN[4]+stringBN[5]+"..."
            }
        }
        return result
    }

    function op(where,access){
        let str="\t\t"
        if(where == "off-chain")
            str+="[players]"
            else if(where == "on-chain")
                str += "[ chain ]"
            else console.log("error in function op",where)
        if(access == "w")
            str+=" <<"
            else if(access == "r")
                str += " >>"
            else console.log("error in function op",access)
        return str
    }

    function quickWerewolfCard(){
        return deck[1]
    }

    function quickDealCardTo(i){
        return deck[i]
    }

    function quickNumSurvive(){return livingPlayers.length - 1}
    
    function quickKilled(player){
        let i = playerNumOf[player]
        players[i].live = false
        let j= theLivingNumOf[player]
        
        for(let k=j; k<= livingPlayers.length-2 ; k++){
            livingPlayers[k] = livingPlayers[k+1]
            theLivingNumOf[livingPlayers[k]]--
        }
        livingPlayers.pop()
        theLivingNumOf[player]=0
    }
    
    function quickDayVoting(name){
        
        quickKilled(name)

    }
    //TODO
    function quickOpenRole(_role, _pokerKey){
        require(verifyRole(_role, _pokerKey)==true);
        uint i = playerNumOf[msg.sender];
        players[i].role = _role;
        players[i].pokerKey=_pokerKey;
        
        living[uint(_role)]--;

        if(living[uint(RoleTypes.Werewolf)]==living[uint(RoleTypes.Seer)]+living[uint(RoleTypes.Villager)]){
            winner = "Werewolves";
        }
        else if(living[uint(RoleTypes.Werewolf)]==0){
            winner = "Humans";
        }
    }

    //TODO
    function quickVerifyRole(RoleTypes _role, uint _pokerKey) pure internal returns(bool){
        
        return (_role!=RoleTypes.Unseen && _pokerKey==456);
    
    }

    async function quickNightKill(victimName, proofCanKill)  {
        let v = playerNumOf[victimName]
        let victim = players[v]
        let result = await quickVerify(proofCanKill, victim)
        assert(result == true,"Reject the proof, he is not werwolf!")        
        quickKilled(victimName)
        console.log(victimName,"is killed at night")
        return true
    }
    
    async function quickVerify(proofCanKill, victim){
        
        let pfs = proofCanKill
        let victimNum = playerNumOf[victim.name]
        let pfVictimNum = pfs[1].victim
        let result
        if(!victimNum.equals(pfVictimNum)){
            console.log("Victim must be same to victim given in proof")
            return false
        }
        
        let isLive = victim.live
        if (isLive != true) console.log( "can't kill: "+victim.name+" is dead!" )
        
        console.log("\tEveryone can check the proof !")
        let Ts = []
        let cTotal = new myBigNumber(0);
        let i = 1
        
        let numSurvive = quickNumSurvive()
        let hands = quickGetSurviveHands()
        let pokHands = passHandsToPoK(hands, numSurvive)
        console.log("\t\t** Everyone can read proof")
        console.log("\t",op("off-chain","r")," ...")
        let pfResult = true
        for(i=1; i<= numSurvive; i++){
            //print(pfs[i])
            let proof = pfs[i]
            console.log("\t\t** Verify proof "+i+":")
            let isPass = await werewolf.verifyWerewolfProof(proof.w,proof.hand,proof.T,proof.c,proof.s)
            console.log("\t\t\t"+isPass)
            if(isPass == true){
                console.log("\t\t\tMaybe he is player "+i+" and he is werewolf ")
            }else{
                console.log("\t\t\the is not player "+i+" Or he is not werewolf")
            }
            pfResult = pfResult && isPass 
            
            Ts[i] = pfs[i].T
            cTotal = cTotal.plus(pfs[i].c).modulo(order);
        }
        let realChallenge = new myBigNumber(await werewolf.computeChallenge(werewolfCard, pokHands, victimNum,Ts))
        let messagePass = cTotal.equals(realChallenge)
        console.log("\t\t** Verify signature and message :",messagePass)
        pfResult = pfResult && messagePass
        result = isLive && pfResult
        return result 
    }

    async function quickCreatePoK(me, pokerKey, victimNum){
        console.log("\n\tWerewolf: I am player ",me,",I want to kill player",victimNum," ! ")
        let numSurvive = quickNumSurvive()
        let hands = quickGetSurviveHands()
        console.log("\t\t** Werewolf collect the living players' hand for proof")
        console.log("\t",op("off-chain","r"),"...")
        console.log("\t\t** Werewolf prepare werewolfCard for proof,","werewolfCard: ",str(werewolfCard,POINT))
        console.log("\t\t** Werewolf prepare his pokerKey for proof,","pokerKey: ",str(pokerKeys[me],{}))

        console.log("\n\t\t** Werewolf caculates proof ...")
        //prepare real proof
        let totalFakeC = new myBigNumber(0);
        let Ts = []
        // m-1 "fake" proof
        let pfs = []
        let i = 1           
        for(i=1; i<me; i++){
            pfs[i] = {w:[],hand:[],victim:0,T:[],c:0,s:0}
            let framedHand = hands[i]
            let proofArray = await werewolf.werewolfFrameKilling(framedHand, werewolfCard, victimNum) 
            pfs[i] = proofFromArray(proofArray)
            console.log("\n\t\t\tWerewolf caculates","proof "+i+"... --> Prove I am player "+i+" and I am werewolf !")

            Ts[i] = pfs[i].T
            //print(pfs[i])
            totalFakeC = totalFakeC.plus(pfs[i].c).modulo(order);
        }
                       
        for( i=me+1; i<=numSurvive; i++){
            
            pfs[i] = {w:[],hand:[],victim:0,T:[],c:0,s:0}
            let framedHand = hands[i]
            let proofArray = await werewolf.werewolfFrameKilling(framedHand, werewolfCard, victimNum)
            pfs[i] = proofFromArray(proofArray)
            console.log("\n\t\t\tWerewolf caculates","proof "+i+"... --> Prove I am player "+i+" and I am werewolf !")

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
        var proofArray = await helloProve(werewolf,pokerKey, werewolfCard, hands[me], victimNum,  realt ,realc)
        //var proofArray = await werewolf.werewolfProve(pokerKey, werewolfCard, hands[me], victimNum,  realt ,realc)

        pfs[me] = proofFromArray(proofArray)
        
        console.log("\n\t\t\tWerewolf caculates","proof "+me+"... --> Prove I am player "+me+" and I am werewolf !")
        let publishMessage = "I want to kill player "+pfs[me].victim.toString(16)
        console.log("\n\t\t** Werewolf appends message:", publishMessage)
        console.log("\t\t** Werewolf publishes PoK")
        console.log("\t",op("off-chain","w"),"...")
        return pfs
    }

    async function helloProve(werewolf,pokerKey, werewolfCard, hand, victimNum,  realt ,realc){
        try{
            return await werewolf.werewolfProve(pokerKey, werewolfCard, hand, victimNum,  realt ,realc)
        }catch(err){
            console.log(err)
        }
    }

    before( async ()=> {
        console.log("\tExecute werewolf program !")
        werewolf = await Werewolf.deployed()
        console.log("\t\t[ chain ] << deploy werewolf contract at",werewolf.address)
        order = await werewolf.cardOrder()//(read from chain only 1 time)
    })

    it("players can prepare deposits",async function(){
        console.log("\n\tPlayers prepare deposits !")
        playerNames = [user1, user2, user3, user4, user5, user6]
        n = playerNames.length
        var i
        for(i=0; i<n; i++){
            console.log("\n\t\t** player",i+1,"prepare deposit $100")
            let p = playerNames[i]
            let v = 100
            console.log("\t\t\t[ chain ] << player",p,"send",v)
            await werewolf.quickDepositGame({from: p, value:100})
            console.log("\t\t** update deposit of player",p)
            let keywordDeposit = werewolf.Deposit({outPlayerName: p})
            let DepositLog = await searchLog(keywordDeposit)
            let playerName = DepositLog.outPlayerName
            let value = DepositLog.outValue
            console.log("\t\t\t[ chain ] >> deposits[",playerName,"] = ",str(value,{}))
            deposits[playerName] = value 
            console.log("\t\t\t[players] << deposits[",playerName,"] = ",str(deposits[playerName],{}))
        }

    })

    it("can engage players",async function(){
        console.log("\tEngage players !")
        console.log("\t\t[ chain ] <<","admin",admin,"\tengage players")
        await werewolf.quickEngagePlayers(playerNames,{from:admin})
        
        let PlayerReady = werewolf.PlayerReady()
        let PlayerReadyLog = await searchLog(PlayerReady)
        n = PlayerReadyLog.numPlayers
        console.log("\n\tUpdate informations of each player !")
        let i
        for(i=1; i<=n; i++){
            console.log("\n\t\t** update informations of player",i)
            let keywordJoinPlayer = werewolf.JoinPlayer({outPlayerNum:i})
            let JoinPlayerLog = await searchLog(keywordJoinPlayer)
            let playerNum = JoinPlayerLog.outPlayerNum
            let playerName = JoinPlayerLog.outPlayerName
            let playerLive = JoinPlayerLog.outPlayerLive
            let playerHand = JoinPlayerLog.outPlayerHand
            let playerRole = JoinPlayerLog.outPlayerRole
            let playerKey = JoinPlayerLog.outPlayerKey
            console.log("\t\t\t[ chain ] >> player",str(playerNum,{}),
                "\n\t\t\t\tname:",playerName,
                "\n\t\t\t\tlive:",playerLive,
                "\n\t\t\t\thand:",str(playerHand,{"point":true}),
                "\n\t\t\t\trole:",str(playerRole,{}),
                "\n\t\t\t\tpokerKey:",str(playerKey,{})
                )
            players[playerNum] = {
                name: playerName,
                live: playerLive,
                hand: playerHand,
                role: playerRole,
                pokerKey: playerKey
            }
            playerNumOf[playerName] = playerNum
            let p = players[playerNum]
            console.log("\t\t\t[players] << player",str(playerNum,{}),
                "\n\t\t\t\tname:",p.name,
                "\n\t\t\t\tlive:",p.live,
                "\n\t\t\t\thand",str(p.hand,{"point":true}),
                "\n\t\t\t\trole:",str(p.role,{}),
                "\n\t\t\t\tpokerKey:",str(p.pokerKey,{})
                )
        }

        for(i=1; i<=n; i++){
            let RegLivingPlayer = await searchLog(werewolf.RegLivingPlayer({livingPlayerNum:i}))
            let {livingPlayerNum,livingPlayerName} = RegLivingPlayer
            livingPlayers[livingPlayerNum] = livingPlayerName
            theLivingNumOf[livingPlayerName] = livingPlayerNum
        }

        let RegLivingRole = await searchLog(werewolf.RegLivingRole())
        living = RegLivingRole.outLiving 
    })

    
    it("can assign roles",async function(){    
        console.log("\tAssign role of player randomly !")
        console.log("\n\t\t** choose card face")
        let i
        for(i=0; i<=n; i++){
            let cardData = await werewolf.quickCreateCard(i,await werewolf.quickPrepareDeck(i))
            deck[i] = cardData[0]
            let cardHash = cardData[1]
            roleOf[cardHash.toString(16)] = cardData[2]
            console.log("")
            console.log(
                op("off-chain","w"),
                "create",i,"th card: ",
                str(deck[i],{"point":true})
            )
            cardHash = await werewolf.hashCard(deck[i])
            console.log(
                op("off-chain","w"),
                "role list (mapping roleOf) is"
            ) 
            console.log(
                "\t\t\tcard",str(deck[i],{"point":true}),
                "==>",
                RoleTypes [roleOf[cardHash.toString(16)]]
            )
            
        }
        werewolfCard = quickWerewolfCard()//player remember each card face 
        
        console.log("\t** shuffle and deal cards")
        console.log(op("off-chain","w"),"modify state of deck and players")
        // skip shuffle and deal, read hand from disk 
        /*
        //console.log("shuffle")
        for(i=1; i<= n; i++){
                console.log("Player",i,"is shuffling the deck ...")
                deck = await werewolf.quickShuffleCardBy(i, pokerKeys[i],deck, n)
                console.log(str(deck[3],{"point":true}))
            }
        
        //console.log("deal card, prepare hands to disk")
        let initialHands = []
        for (i=1; i<=n; i++){
            initialHands[i] = quickDealCardTo(i)// This is a ref to deck
            console.log("\nDeal card")
            console.log(str(initialHands[i],{"point":true}))
            console.log("to player",i)
        }
        //console.log("recover card, write hands to disk")
        let j
        for(i=1; i<=n; i++){
                console.log("\nPlayer",i,"recover her card")
                for(j=1;j<=n;j++){
                    console.log("\twith Player",j,"\'s help")
                    initialHands[i] = await werewolf.helpDecryptRole(j, pokerKeys[j], i, initialHands[i])
                    console.log("==>",str(initialHands[i], POINT))
                }
            }

        console.log("write to disk")
        let outStrHands = ""
        for(i=1; i<=n; i++){
            let initialHand = "0x"+initialHands[i][0].toString(16)+","+"0x"+initialHands[i][1].toString(16)+"\n"
            outStrHands += initialHand
        }
        await writeFile('initialHands.txt',outStrHands)
        */
        
        let inStrHands
        try{
            inStrHands = await readFile("C:\\Users\\eason\\Documents\\GitHub\\SmartWerewolf\\initialHands.txt","utf8")
            //readFile return the whole texts 
            //(not the arguments passed to readFile's call back)
        }catch(err){
            console.log("error",err)
        }
        
        let start = 0
        for(i = 1; i<=n; i++){
            let camma = inStrHands.indexOf(",",start)
            let endline = inStrHands.indexOf("\n",start)
            let x = new myBigNumber(inStrHands.substring(start, camma),16)
            let y = new myBigNumber(inStrHands.substring(camma +1, endline), 16)
            players[i].hand = [x,y]
            start = endline + 1
        }

        console.log("\t** Everyone can check his role")
        console.log("\t\t           role (secret)\tpokerKey (secret)\t\thand (public)")
        for(let i=1; i<=n; i++){
            let hand = players[i].hand
            let roleCard = await werewolf.recoverRole(i, pokerKeys[i], players[i].hand)
            let cardHash = await werewolf.hashCard(roleCard)
            let role = RoleTypes[roleOf[cardHash.toString(16)]]

            console.log("\t\tplayer "+i+" : "+role+"\t\t"+str(pokerKeys[i],{})+"\t\t"
            +str(hand,{"point":true}))
        }      
    })

    it("werewolf can create proof of knowledge",async function(){
        console.log("\tIt's Night 1 ! Werewolf will kill a person !")
        pfs = await quickCreatePoK(1, pokerKeys[1], 4)
        assert(typeof pfs != "undefined","can't await quickCreatePoK")
    })
    
    it("werewolf can kill",async function(){
        let result = await quickNightKill(players[4].name, pfs)
        if(result != true)console.log("Kill failed !")
    })

    after(  async ()=> {     
        //console.log("get contract informations ... ")
        //console.log("address=\""+werewolf.address+"\"")
        //console.log("abi="+JSON.stringify(werewolf.abi))

    })
  
})