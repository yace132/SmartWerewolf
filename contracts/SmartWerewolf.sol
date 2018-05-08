pragma solidity ^0.4.7;
import "./OrPoK.sol";

contract SmartWerewolf {
    //parameters using bitcoin's curve (fixed for every game)
    uint constant p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;
    uint constant Gx =0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
    uint constant Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;
    uint public constant q = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;
    OrPoK processPoK; 

    //bullet broad (fixed during 1 game)
    Player[] public players;
    uint[] MPC;
    uint[2][] public deck;
    uint public n;
    uint[2] G;
    mapping (address => uint) public playerNumOf;
    mapping(bytes32 => uint) public roleOf;
    mapping(address => uint) public deposits;
    
    //up-to-date report (change in game)
    mapping(uint => uint) public living;
    address[] public livingPlayers;
    mapping(address => uint) public theLivingNumOf;
    string public winner;
    
    function SmartWerewolf(address addressPoK) public {
        processPoK = OrPoK(addressPoK);
        G[0] = Gx;
        G[1] = Gy;
    }

    //1. 集合玩家
    function engagement(address[] _players) public {
        require(_players.length >= 6);
        n = _players.length;
        players.length = 1+ n;
        uint i;
        for (i = 1; i <= n; i++) {
            players[i] = Player
            (
                {
                    name: _players[ i-1 ],  
                    live: true, 
                    hand: [uint(0),0], 
                    role: RoleTypes.Unseen,
                    pokerKey: 0
                }
           ); 
        playerNumOf[players[i].name] = i;
        }
        
        living[uint(RoleTypes.Werewolf)]=2;
        living[uint(RoleTypes.Seer)]=1;
        living[uint(RoleTypes.Villager)]=n-3;

        livingPlayers.length=n+1;
        for(i=1;i<=n;i++){
            livingPlayers[i]=players[i].name;
            theLivingNumOf[players[i].name]=i;
        }
    }

    function depositGame(address player) external payable {
        deposits[ player ] = msg.value;
    }

    /*function offChainEngage(address[] inPlayers) 
        public 
        returns(
            uint nOut,
            Player[] outPlayers,
            uint[4] outLiving,
            address[] outLivingPlayers
        )
    {
        require(inPlayers.length >= 6);
        uint i;
        for(i = 0; i<inPlayers.length; i++){
            address p = inPlayers[i];
            require(deposits[p]>=100);
        }

        n = inPlayers.length;
        nOut = n; 

        players.length = 1+n;
        outPlayers = new Player[](1+nOut);

        for (i = 1; i <= n; i++) {
            players[i] = Player
            (
                {
                    name: inPlayers[ i-1 ],  
                    live: true, 
                    hand: [uint(0),0], 
                    role: RoleTypes.Unseen,
                    pokerKey: 0
                }
            );
            outPlayers[i] = Player(players[i].name, players[i].live, [uint((players[i].hand)[0]),(players[i].hand)[1]], players[i].role, players[i].pokerKey);
        
        }
        
        outLiving[uint(RoleTypes.Werewolf)]=2;
        outLiving[uint(RoleTypes.Seer)]=1;
        outLiving[uint(RoleTypes.Villager)]=nOut-3;

        outLivingPlayers = new address[](nOut+1);
        for(i=1;i<=nOut;i++){
            outLivingPlayers[i]=players[i].name;
            //theLivingNumOf[players[i].name]=i;//how to output map?
        }
    }
    
    function setPlayerIndex() public {
        uint i;
        for(i=1; i<=n; i++)
        playerNumOf[players[i].name] = i;//how to output map?

    }
    */
    function engagePlayer(address[] inPlayers) 
        public 
    {   
        require(inPlayers.length >= 6);
        uint i;
        for(i = 0; i<inPlayers.length; i++){
            address p = inPlayers[i];
            require(deposits[p]>=100);
        }

        n = inPlayers.length;
        nOut = n; 

        players.length = 1+n;
        outPlayers = new Player[](1+nOut);

        for (i = 1; i <= n; i++) {
            players[i] = Player
            (
                {
                    name: inPlayers[ i-1 ],  
                    live: true, 
                    hand: [uint(0),0], 
                    role: RoleTypes.Unseen,
                    pokerKey: 0
                }
            );
            
            emit JoinPlayer(
                i, 
                players[i].name, 
                players[i].live, 
                [uint((players[i].hand)[0]),(players[i].hand)[1]], 
                players[i].role, 
                players[i].pokerKey,
            );

        }


        require(deposits[inPlayer]>=100);
        if(players.length == 0)
            players.length=1;
        players.push(Player({name: inPlayer, live: true, hand: [uint(0),0], role: RoleTypes.Unseen, pokerKey: 0}));
        playerNumOf[inPlayer] = players.length - 1;
        uint i = playerNumOf[inPlayer];

        emit JoinPlayer(
            i, 
            players[i].name, 
            players[i].live, 
            [uint((players[i].hand)[0]),(players[i].hand)[1]], 
            players[i].role, 
            players[i].pokerKey,
        );
    }
    
    
   //read off-chain(from js) 
    function regTheLiving public view returns(
        uint livingPlayerNum,
        address livingPlayerName
        )
    {
        i,
        players[i].name
        living[uint(RoleTypes.Werewolf)]=2;
        living[uint(RoleTypes.Seer)]=1;
        living[uint(RoleTypes.Villager)]=n-3;
    }

    //2-1 印製牌
    //(a) 印牌面   
    function createCards() public {   
        MPC.length = deck.length = 1+n;
        for(uint i=0; i <= n; i++ ){
            prepareDeck(i);
        }
        for(i=0; i<=n; i++){
            (deck[i][0], deck[i][1]) = multiply(MPC[i], G);
        }
        generateMap(deck[0], RoleTypes.Unseen);
        generateMap(deck[1], RoleTypes.Werewolf);
        generateMap(deck[2], RoleTypes.Werewolf);
        generateMap(deck[3], RoleTypes.Seer);
        for (uint j = 4; j <= n; j++) {
            generateMap(deck[j], RoleTypes.Villager);
        }
    }
    function shuffleCardBy(uint i, uint pokerKey) external{
        //encrypt each card
        uint printBack = pokerKey; 
        for(uint k=0; k<=n; k++){
            (deck[k][0], deck[k][1]) = multiply(printBack, deck[k]);
        }
        //any shuffle
        /*uint[2] memory tmp;
        uint j = ((i+3)-1) % n + 1;
        (tmp[0], tmp[1]) = (deck[j][0], deck[j][1]);
        (deck[j][0], deck[j][1]) = (deck[i][0], deck[i][1]);
        (deck[i][0], deck[i][1]) = (tmp[0], tmp[1]);*/
    }
    //TODO:(b)洗牌、印製牌背  
    function shuffleCards() public {
        uint printBack = 0x7717; 
        for(uint i=0; i<=n; i++){
            (deck[i][0], deck[i][1]) = multiply(printBack, deck[i]);
        }
        uint[2] memory tmp;
        (tmp[0], tmp[1]) = (deck[2][0], deck[2][1]);
        (deck[2][0], deck[2][1]) = (deck[5][0], deck[5][1]);
        (deck[5][0], deck[5][1]) = (tmp[0], tmp[1]);
    } 

    //TODO: 2-2. 發牌 
    function dealCards() public {
        for(uint i=1; i<=n; i++){
            (players[i].hand[0], players[i].hand[1])  
            = (deck[i][0], deck[i][1]);
        }
        helpDecryptRole();
    }

    function dealCardTo(uint i) external view returns(uint[2] hand){
        (hand[0],hand[1])=(deck[i][0], deck[i][1]);
    }

    function nightKill(address victimName, uint proofCanKill) public {
        uint v = playerNumOf[victimName];
        Player memory victim = players[v];
        require (verify(proofCanKill, victim)==true);
        killed(victimName);
    }
    
    function dayVoting(address name) public {
        
        killed(name);

    }

    function openRole(RoleTypes _role, uint _pokerKey) public {
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

    function roleOf(uint[2] card) public view returns(uint) {return roleOf[keccak256(card)];}
    function cardOrder() public pure returns(uint) {return q;}
    function getHandOf(address name) public view returns(uint[2] hand){
        uint i = playerNumOf[name];
        (hand[0] ,hand[1]) = ((players[i].hand)[0], (players[i].hand)[1]);
    }

    function numSurvive() public view returns(uint) {return livingPlayers.length-1;}

    function werewolfFrameKilling(uint[2] framedHand, uint[2] _werewolfCard,  uint victim) public view returns(uint[2] __werewolfCard, uint[2] _framedHand, uint _victim, uint[3] T, uint c, uint s){
        return processPoK.forgeProof(_werewolfCard, framedHand, victim);
    }

    function werewolfCard() external view returns(uint cardX,uint cardY){
        (cardX, cardY) = (deck[1][0], deck[1][1]);
    }
    
    function werewolfChooset(uint pokerKey, uint[2][] hands, uint[2] _werewolfCard, uint victim ) external view returns(uint realt){

        return processPoK.computeRealt(_werewolfCard, hands, pokerKey, victim);
    }

    function werewolfComputeT(uint realt, uint[2] _werewolfCard) public view returns(uint[3] realT){
        return processPoK.computeTFrom(realt, _werewolfCard);
    }

    function computeChallenge(uint[2] _werewolfCard, uint[2][] _hands, uint victim, uint[3][] Ts) public view returns(uint realChallenge){
        return processPoK.computeChallenge(_werewolfCard, _hands, victim, Ts);
    }

    function werewolfProve(uint pokerKey, uint[2] _werewolfCard, uint[2] hand, uint victim, uint tReady,uint cReady) public view returns(uint[2] __werewolfCard, uint[2] _hand, uint _victim, uint[3] T, uint c, uint s){
        return processPoK.createSchnorr(pokerKey, _werewolfCard, hand, victim, tReady, cReady);
    }

    function verifyWerewolfProof(uint[2] _werewolfCard, uint[2] hand,  uint[3] T, uint c, uint s) public view returns (bool result){
        return processPoK.verifySchnorr(_werewolfCard, hand, T, c, s);
    }

    function prepareDeck(uint i) internal {
        
        MPC[ i ] = (i+123) % q;
        //avoid use 0. function toZ1 revert at point at infinity
    
    }
    
    function helpDecryptRole() internal {
        for(uint i=1; i<=n; i++){
        	uint[2] storage hand = players[i].hand;
        	hand[0] ++;
        } 
    }

    function helpDecryptRole(uint me, uint pokerKey, uint i, uint[2] cipherCard) external view returns (uint[2] decryptCard){
        if(me == i){
            (decryptCard[0], decryptCard[1]) = (cipherCard[0], cipherCard[1]);
        }else{
            uint keyInverse = ECCMath_noconflict.invmod(pokerKey, q);
            (decryptCard[0],decryptCard[1]) = multiply(keyInverse, cipherCard);
        }
       
    }

    function killed(address player) internal{
        uint i = playerNumOf[player];
        players[i].live=false;
        uint j= theLivingNumOf[player];
        
        for(uint k=j; k<= livingPlayers.length-2 ; k++){
            livingPlayers[k] = livingPlayers[k+1];
            theLivingNumOf[livingPlayers[k]]--;
        }
        livingPlayers.length--;
        theLivingNumOf[player]=0;
    }


    function multiply(uint s, uint[2] point) public view returns(uint ,uint){
        uint[3] memory result = Secp256k1_noconflict._mul(s, point);
        ECCMath_noconflict.toZ1(result, p);
        return (result[0],result[1]);
    }

    function generateMap(uint[2] card, RoleTypes role) internal {
        
        roleOf[keccak256(card)] = uint(role);
    
    }

    function verifyRole(RoleTypes _role, uint _pokerKey) pure internal returns(bool){
        
        return (_role!=RoleTypes.Unseen && _pokerKey==456);
    
    }
    
    function verify(uint proofCanKill, Player victim) pure internal returns(bool){
        
        return proofCanKill == 123 && victim.live == true;
    }
    
    enum RoleTypes{Unseen, Werewolf, Seer, Villager}
    
    struct Player{
        address name;
        bool live;
        uint[2] hand;
        RoleTypes role;
        uint pokerKey;
    }

   struct KillConditions{
        uint iAmWerewolf;
        uint iAmLive;
        uint victimLive;
    }
   
    event debug(uint i);
    event JoinPlayer(
        uint outPlayerNum,
        address outPlayerName,
        bool outPlayerLive,
        uint[2] outPlayerHand,
        RoleTypes outPlayerRole,
        uint outPlayerKey,
    );
}