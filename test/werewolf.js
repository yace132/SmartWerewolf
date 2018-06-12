    'use strict'
    const PoK = artifacts.require("./OrPoK.sol")
    const programWerewolf = artifacts.require("./SmartWerewolf.sol")
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
        var pok, werewolf, abi, order, playerNames, numSurvive
        var publishProofs = []
        var publishVictim
        var openCard = {}

        
        var werewolfCard
        //Everyone should remember this card for werewolf proof and verify
        
        var players =[]
        //in solidity: MPC
        var deck = []
        var n
        //in solidity: G
        var playerNumOf ={}
        var roleOf = {}// card # => 0, 1, 2, 3
        var deposits = {}
        
        var living = []
        var livingPlayers = []
        var theLivingNumOf = {}
        var winner
        const Unseen = "Unseen"
        const Werewolf = "Werewolf"
        const Seer="  Seer  "
        const Villager="Villager"
        var RoleTypes = [Unseen,Werewolf,Seer,Villager]// # => string

        const POINT = {"point":true}
        const GameIs = Object.freeze({SetUpOnChain:0, PrepareDeposits:1, InitPlayers:2, AssignRoles:3, Night:4, Day:5})
        var gameClock = { room:-1, day:-1, phase: GameIs.SetUpOnChain }
        var sig = {}
        var pokerKeys = [
        web3.toBigNumber(0), 
        web3.toBigNumber(0x10000e5ccbfb04590405997ee2d52d2b330726137b875053c36da4e974d162f),
        web3.toBigNumber(0x200008e4a1235a6d2687f1a7e3ba17bc98c673636790f1b8ad91cc3c05875ef1),
        web3.toBigNumber(0x3000b70312345bea894b6aeff5a544fb92e78a18e19814cd85dd83b71f772aa6), 
        web3.toBigNumber(0x400c684f0ba1aaaaaa716adb5d21a053ea8e90277d0868337229f97bede61418),
        web3.toBigNumber(0x5000cbb0e2411bbbbbb3778987b1e22153c086a95e00018bdf89de078917abc63), 
        web3.toBigNumber(0x6000052c865f5763aad42add43856927612345678a00062d36b2bae914d58b8c8)]
        var selfRoles = []

        //depreciated
        const generateZKProof = function () {
            // generate zk here
            return 123
        }

        const quickPrintSurvive = function() {
            let livingPeople = "players "
            for(let i=1; i<=quickNumSurvive(); i++){
                let name = livingPlayers[i]
                let j = playerNumOf[name]
                livingPeople+=j
                livingPeople+=", "
            }
            livingPeople+="are live !"
            return livingPeople
        }

        //on-chain state (read from chain)
        //We need off-chain state avoid writing to block chain
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

        //convenient functions
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
                let pf = {w:[], hand:[], /*victim: 0,*/ T:[], c: 0, s:0}
                pf.w = arrayProof[0]
                pf.hand = arrayProof[1]
            //pf.victim = arrayProof[2]
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

        function opNoTab(where,access){
            let str=""
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

                function title(level){
                    let tabs = ""
                    for(let i=1;i<=level;i++){
                        tabs += "\t"
                    }
                    return tabs
                }

        // game functions
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
        
        async function quickRoleOf(card){
            let cardHash = await werewolf.cardToNumber(card)    
            return roleOf[cardHash.toString(16)]
        }

        function quickOpenCard(roleCard, pokerKey){
            return {roleCard, pokerKey}
        }

        async function quickVerifyRole(name){
            let hand = quickGetHandOf(name)
            let {roleCard, pokerKey} = openCard[name]

            let provideHand = await werewolf.multiply(pokerKey,roleCard)
            return (provideHand[0].equals(hand[0])) && (provideHand[1].equals(hand[1]))
        }

        async function quickOpenRole(name){
            let i = playerNumOf[name]
            let p = players[i]
            if(p.live == true){
                console.log(title(2)+"** can only open the dead's role !")
                console.log(title(3)+"but player",i,"is still live")
                return 0
            }
            let result = await quickVerifyRole(name)
            if(result != true){
                console.log(title(2)+"** can't recover role of "+name)
                return 0
            }
            let {roleCard,pokerKey} = openCard[name]
            let role = await quickRoleOf(roleCard)
            role = role.toNumber()
            p.role = RoleTypes[role]
            p.pokerKey=pokerKey

            living[role]--

            if(living[RoleTypes.indexOf(Werewolf)]==living[RoleTypes.indexOf(Seer)]+living[RoleTypes.indexOf(Villager)]){
                winner = "Werewolves"
            }else if(living[RoleTypes.indexOf(Werewolf)]==0){
                winner = "Humans"
            }else
            console.log(
                title(2)+Werewolf,
                ":",
                living[RoleTypes.indexOf(Werewolf)]
                )
            console.log(
                title(2)+Seer,
                ":",
                living[RoleTypes.indexOf(Seer)]
                )
            console.log(
                title(2)+Villager,
                ":",
                living[RoleTypes.indexOf(Villager)]
                )
            return p.role
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
                pfs[i] = {w:[],hand:[],/*victim:0,*/T:[],c:0,s:0}
                let framedHand = hands[i]
                let proofArray = await werewolf.werewolfFrameKilling(framedHand, werewolfCard, victimNum) 
                pfs[i] = proofFromArray(proofArray)
                console.log("\n\t\t\tWerewolf caculates","proof "+i+"... --> Prove I am player "+i+" and I am werewolf !")

                Ts[i] = pfs[i].T
                //print(pfs[i])
                totalFakeC = totalFakeC.plus(pfs[i].c).modulo(order);
            }

            for( i=me+1; i<=numSurvive; i++){

                pfs[i] = {w:[],hand:[],/*victim:0,*/T:[],c:0,s:0}
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
            
            pfs[me] = {w:[],hand:[], /*victim:0,*/T:[],c:0,s:0}
            var proofArray = await werewolf.werewolfProve(pokerKey, werewolfCard, hands[me], victimNum,  realt ,realc)
            pfs[me] = proofFromArray(proofArray)
            console.log("\n\t\t\tWerewolf caculates","proof "+me+"... --> Prove I am player "+me+" and I am werewolf !")
            //catch error in werewolfProve
            if(pfs[me].c == 0 && pfs[me].s == 0){
                console.log(title(4)+"** You are not werewolf ! Or you are not player",me)
                console.log(title(5)+"You provide key:",str(pokerKey,{}))
                console.log(title(5)+"You frame player",me) 
                console.log(title(5)+"(Your key) * (werewolfCard)")
                console.log(title(5)+str([pfs[me].T[0], pfs[me].T[1]],POINT))
                console.log(title(5)+" =\\= his hand "+str(hands[me],POINT))
            }
            
            
            let publishMessage = "I want to kill player "+victimNum
            console.log("\n\t\t** Werewolf signs the message:", publishMessage)
            return {pfs, victimNum}
        }

        async function quickVerify(proofCanKill, victim){


            let pfs = proofCanKill
            let victimNum = playerNumOf[victim.name]
            let result
            
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
                    console.log("\t\t\tHe is NOT player "+i+" or he is NOT werewolf !")
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

        //verify and kill
        async function quickNightKill(victimName, proofCanKill)  {
            let v = playerNumOf[victimName]
            let victim = players[v]
            let result = await quickVerify(proofCanKill, victim)
            if(result != true){
                return false        
            }else{
                quickKilled(victimName)
                console.log(title(2)+"** player",v,"is killed at night")
                
                console.log(title(3)+opNoTab("off-chain","w"),"...")
                return true
            }        
        }
        
        function statesToChain(){
            let {currentLives, currentHands, currentRoles, currentPokerKeys} = playersToChain()
            console.log("life",currentLives)
            let currentCardNumbers = cardNumbersToChain()
            let {currentRoom, currentDay, currentPhase} = gameClockToChain()
            let currentDeposits = depositsToChain()
            return {
                currentLives, 
                currentHands, 
                currentRoles, 
                currentPokerKeys,
                currentCardNumbers,
                currentRoom, 
                currentDay, 
                currentPhase,
                currentDeposits
            }
        }

        async function hashStatesToChain(states){
            let{
                currentLives, 
                currentHands, 
                currentRoles, 
                currentPokerKeys,
                currentCardNumbers,
                currentRoom, 
                currentDay, 
                currentPhase,
                currentDeposits
            } = states
            console.log({states})
            let statesHash = await werewolf.quickHashStates(
                currentLives, 
                currentHands, 
                currentRoles, 
                currentPokerKeys,
                currentCardNumbers,
                currentRoom, 
                currentDay, 
                currentPhase,
                currentDeposits
            )
            return statesHash
        }

        async function signStatesToChain(name, states){
            let statesHash = await hashStatesToChain(states)
            console.log("hash OK")
            let statesString = statesHash.toString(16)
            let statesMessage = "0x" + statesString
            console.log("message OK")
            let statesSig = web3.eth.sign(name, statesHash.toString(16))
            console.log("sign OK")
            let rOfStatesSig = statesSig.slice(0, 66)
            let sOfStatesSig = "0x" + statesSig.slice(66, 130)
            let vOfStatesSig = "0x" + statesSig.slice(130, 132)
            vOfStatesSig = web3.toDecimal(vOfStatesSig)
            return { statesMessage, rOfStatesSig, sOfStatesSig, vOfStatesSig }   
        }

        //return multiple array
        function playersToChain(){
            let currentLives = [] 
            let currentHands = []
            let currentRoles = []
            let currentPokerKeys =[]
            for(let i=1;i<=n;i++){
                currentLives[i] = players[i].live
                currentHands[i]= [players[i].hand[0], players[i].hand[1]]
                currentRoles[i] = RoleTypes.indexOf(players[i].role)
                currentPokerKeys[i] = players[i].pokerKey
            }
            return {currentLives, currentHands, currentRoles, currentPokerKeys}
        }

        //return card number array
        function cardNumbersToChain(){
            return Object.keys(roleOf).map(cardNumString => new myBigNumber(cardNumString,16))
        }
        
        //return object
        function gameClockToChain(){
            let currentRoom = gameClock.room
            let currentDay = gameClock.day
            let currentPhase = gameClock.phase
            return {currentRoom, currentDay, currentPhase}
        }

        //return array
        function depositsToChain(){
            return Object.values(deposits)
        }

        //game execute
        before( async ()=> {
            console.log("\tExecute werewolf program !")
            werewolf = await programWerewolf.deployed()
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
                    role: playerRole.toNumber(),
                    pokerKey: playerKey
                }

                playerNumOf[playerName] = playerNum.toNumber()
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
                theLivingNumOf[livingPlayerName] = livingPlayerNum.toNumber()
            }

            let RegLivingRole = await searchLog(werewolf.RegLivingRole())
            living = RegLivingRole.outLiving
            for(i =0; i<=3; i++)
                living[i] = living[i].toNumber()
        })

        it("can design card face",async function(){
            console.log("\n\t\t** choose card face")
            let i
            for(i=0; i<=n; i++){
                let cardData = await werewolf.quickCreateCard(i,await werewolf.quickPrepareDeck(i))
                deck[i] = cardData[0]
                let cardHash = cardData[1]
                roleOf[cardHash.toString(16)] = cardData[2]
                console.log(
                    op("off-chain","w"),
                    "create",i,"th card: ",
                    str(deck[i],{"point":true})
                    )
                cardHash = await werewolf.cardToNumber(deck[i])
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
        })
        
        
        it("can shuffle and deal",async function(){
            console.log("\t** shuffle and deal cards")
            console.log(op("off-chain","w"),"modify state of deck and players")
            // skip shuffle and deal, read hand from disk 
            
            console.log("showing details ...")
            //console.log("shuffle")
            for(let i=1; i<= n; i++){
                    console.log("Player",i,"is shuffling the deck ...")
                    deck = await werewolf.quickShuffleCardBy(i, pokerKeys[i],deck, n)
                    if(deck===0)
                        console.log("Your key may be invalid, e.g. out of range")
                    for(let j=1;j<=n;j++)
                        console.log(str(deck[j],{"point":true}))
                }

            //console.log("deal card, prepare hands to disk")
            let initialHands = []
            for (let i=1; i<=n; i++){
                initialHands[i] = quickDealCardTo(i)// This is a ref to deck
                console.log("\nDeal card")
                console.log(str(initialHands[i],{"point":true}))
                console.log("to player",i)
            }

            //console.log("recover card, write hands to disk")
            let j
            for(let i=1; i<=n; i++){
                console.log("\nPlayer",i,"recover her card")
                for(j=1;j<=n;j++){
                    console.log("\twith Player",j,"\'s help")
                    initialHands[i] = await werewolf.helpDecryptRole(j, pokerKeys[j], i, initialHands[i])
                    console.log("==>",str(initialHands[i], POINT))
                }
            }

            console.log("write to disk")
            let outStrHands = ""
            for(let i=1; i<=n; i++){
                let initialHand = "0x"+initialHands[i][0].toString(16)+","+"0x"+initialHands[i][1].toString(16)+"\n"
                outStrHands += initialHand
            }

            await writeFile('initialHands.txt',outStrHands)
            console.log("Players succesfully generate initail hands")

            console.log("\tAssign role of player randomly !")
            let inStrHands
            try{
                inStrHands = await readFile("C:\\Users\\eason\\Documents\\GitHub\\SmartWerewolf\\initialHands.txt","utf8")
                //readFile return the whole texts 
                //(not the arguments passed to readFile's call back)
            }catch(err){
                console.log("error",err)
            }

            let start = 0
            for(let i = 1; i<=n; i++){
                let camma = inStrHands.indexOf(",",start)
                let endline = inStrHands.indexOf("\n",start)
                let x = new myBigNumber(inStrHands.substring(start, camma),16)
                let y = new myBigNumber(inStrHands.substring(camma +1, endline), 16)
                players[i].hand = [x,y]
                start = endline + 1
            }
        })
        
        
        xit("skip shuffle and deal",async function(){
            console.log("\t** shuffle and deal cards")
            console.log(op("off-chain","w"),"modify state of deck and players")
            
            console.log("\tAssign role of player randomly !")

            let inStrHands
            try{
                inStrHands = await readFile("C:\\Users\\eason\\Documents\\GitHub\\SmartWerewolf\\initialHands.txt","utf8")
                //readFile return the whole texts 
                //(not the arguments passed to readFile's call back)
            }catch(err){
                console.log("error",err)
            }

            let start = 0
            for(let i = 1; i<=n; i++){
                let camma = inStrHands.indexOf(",",start)
                let endline = inStrHands.indexOf("\n",start)
                let x = new myBigNumber(inStrHands.substring(start, camma),16)
                let y = new myBigNumber(inStrHands.substring(camma +1, endline), 16)
                players[i].hand = [x,y]
                start = endline + 1
            }
        })

        it("can check self role",async function(){
            console.log("\t** Everyone can check his role")
            console.log("\t\t           role (secret)\tpokerKey (secret)\t\thand (public)")
            for(let i=1; i<=n; i++){
                let hand = players[i].hand
                console.log({hand})
                let roleCard = await werewolf.recoverRole(i, pokerKeys[i], players[i].hand)
                console.log("recover",i,roleCard)
                selfRoles[i] = roleCard
                let cardHash = await werewolf.cardToNumber(roleCard)
                console.log({cardHash})
                console.log(roleOf[cardHash.toString(16)])
                let role = RoleTypes[roleOf[cardHash.toString(16)]]
                console.log({role},i)
                console.log("\t\tplayer "+i+" : "+role+"\t\t"+str(pokerKeys[i],{})+"\t\t"
                    +str(hand,{"point":true}))
            }      
        })

        
        /*
        it("werewolf can create proof of knowledge",async function(){
            console.log("\tIt's Night 1 ! Werewolf will kill a person !")
            let {pfs, victimNum} = await quickCreatePoK(1, pokerKeys[1], 4)

            publishProofs = pfs
            publishVictim = players[victimNum].name
            console.log("\t\t** Werewolf publishes PoK ")
            //for(let i=1;i<=n;i++)
            //    print(publishProofs[i])
            let j = playerNumOf[publishVictim]
            console.log("\t\t   with message : I want to kill player", j)
            console.log("\t",op("off-chain","w"),"...")
            
            assert(typeof publishProofs != "undefined","can't await quickCreatePoK")
        })
        
        it("werewolf can kill",async function(){
            let result = await quickNightKill(publishVictim, publishProofs)
            if(result != true){
                console.log("\n"+title(2)+"** Reject the proof: not werewolf or provide wrong victim !")
                console.log("\n"+title(2)+"** Kill failed ! May go to on-chain resolution")
            }
        })

        it("can open role",async function(){
            console.log(title(1)+"The victim should open his role !")
            let i = 4
            let p = players[i]
            openCard[p.name] = quickOpenCard(selfRoles[i], pokerKeys[i])
            let role = await quickOpenRole(p.name)
            if(role)
                console.log(title(2)+"** open role: dead player",i,"is",role)
            else
                console.log(title(2)+"** open role: failed !")
        })
        */
        it("Day 1 :  dayVoting",async function(){
            console.log(title(1)+"Convenient test day voting !")
            let i = 2
            let p = players[i]
            quickDayVoting(p.name)
            console.log(title(2)+"kill player",i)
            console.log(title(2)+quickPrintSurvive())
            

            openCard[p.name] = quickOpenCard(selfRoles[i], pokerKeys[i])
            let role = await quickOpenRole(p.name)
            if(role)
                console.log(title(2)+"** open role: dead player",i,"is",role)
            else
                console.log(title(2)+"** open role: failed !")
            if(winner)console.log(title(2)+"winner",winner)
        })
        
        it("Day 2 :  dayVoting",async function(){
            console.log(title(1)+"Convenient test day voting !")
            let i = 5
            let p = players[i]
            quickDayVoting(p.name)
            console.log(title(2)+"kill player",i)
            console.log(title(2)+quickPrintSurvive())

            openCard[p.name] = quickOpenCard(selfRoles[i], pokerKeys[i])
            let role = await quickOpenRole(p.name)
            if(role)
                console.log(title(2)+"** open role: dead player",i,"is",role)
            else
                console.log(title(2)+"** open role: failed !")
            if(winner)console.log(title(2)+"winner",winner)
        })

        it("Day 3 :  dayVoting",async function(){
            console.log(title(1)+"Convenient test day voting !")
            let i = 3
            let p = players[i]
            quickDayVoting(p.name)
            console.log(title(2)+"kill player",i)
            console.log(title(2)+quickPrintSurvive())

            openCard[p.name] = quickOpenCard(selfRoles[i], pokerKeys[i])
            let role = await quickOpenRole(p.name)
            if(role)
                console.log(title(2)+"** open role: dead player",i,"is",role)
            else
                console.log(title(2)+"** open role: failed !")
            if(winner)console.log(title(2)+"winner",winner)
        })

        it("Day 4 :  dayVoting",async function(){
            console.log(title(1)+"Convenient test day voting !")
            let i = 6
            let p = players[i]
            quickDayVoting(p.name)
            console.log(title(2)+"kill player",i)
            console.log(title(2)+quickPrintSurvive())

            openCard[p.name] = quickOpenCard(selfRoles[i], pokerKeys[i])
            let role = await quickOpenRole(p.name)
            if(role)
                console.log(title(2)+"** open role: dead player",i,"is",role)
            else
                console.log(title(2)+"** open role: failed !")
            if(winner)console.log(title(2)+"winner",winner)
        })

        it("can sign current states",async function(){
            let currentStates = statesToChain()
            let {statesMessage, rOfStatesSig, vOfStatesSig, sOfStatesSig} = await signStatesToChain(players[2].name,currentStates)
            console.log("states:",currentStates,"sig:", statesMessage)
            console.log("r",rOfStatesSig,"s",sOfStatesSig,"v",vOfStatesSig)
        })

        after(  async ()=> {     
            //console.log("get contract informations ... ")
            //console.log("address=\""+werewolf.address+"\"")
            //console.log("abi="+JSON.stringify(werewolf.abi))
        })

    })