pragma solidity ^0.4.19;
import "./CDSProtocol.sol";
import "./OrPoK.sol";

contract SmartWerewolf {
    
    //bullet broad
    Player[] public players;
    uint[] MPC;
    uint[2][] public deck;
    uint public n;
    uint[2] G;
    mapping (address => uint) public playerNumOf;
    mapping(bytes32 => uint) public roleOf;
    
    //parameters using bitcoin's curve
    uint constant p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;
    uint constant Gx =0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
    uint constant Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;
    uint public constant q = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;
   
    //up-to-date report
    mapping(uint => uint) public living;
    address[] public livingPlayers;
    mapping(address => uint) public theLivingNumOf;
    string public winner;
    
    function SmartWerewolf() public {
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
        emit PlayerReady(n);
    }
    
    function roleOf(uint[2] card) public view returns(uint){
        return roleOf[keccak256(card)];
    }

    function multiply(uint s, uint[2] point) internal returns(uint ,uint){
        uint[3] memory result = Secp256k1_noconflict._mul(s, point);
        ECCMath_noconflict.toZ1(result, p);
        return (result[0],result[1]);
    }

    function generateMap(uint mpc, uint[2] card, RoleTypes role) internal {
        (card[0], card[1]) = multiply(mpc, G);
        roleOf[keccak256(card)] = uint(role);
    }

    //2-1 印製牌
    //(a) 印牌面   
    function createCards() public {   
        MPC.length = deck.length = 1+n;
        for(uint i=0; i <= n; i++ ){
            prepareDeck(i);
        }
        generateMap(MPC[0], deck[0], RoleTypes.Unseen);
        generateMap(MPC[1], deck[1], RoleTypes.Werewolf);
        generateMap(MPC[2], deck[2], RoleTypes.Werewolf);
        generateMap(MPC[3], deck[3], RoleTypes.Seer);
        for (uint j = 4; j <= n; j++) {
            generateMap(MPC[j], deck[j], RoleTypes.Villager);
        }
    }
    
    //TODO:(b)洗牌、印製牌背  
    function shuffleCards() public {
        uint printBack = 0x777; 
        for(uint i=0; i<=n; i++){
            (deck[i][0], deck[i][1]) = multiply(printBack, deck[i]);
        }
        uint[2] memory tmp = deck[2];
        deck[2] = deck[5];
        deck[5] = tmp;
    } 

    //TODO: 2-2. 發牌 
    function dealCards() public {
        for(uint i=1; i<=n; i++){
            players[i].hand = deck[i];
        }
        helpDecryptRole();
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

    function verify(uint proofCanKill, Player victim) pure internal returns(bool){
        
        return proofCanKill == 123 && victim.live == true;
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

    function verifyRole(RoleTypes _role, uint _pokerKey) pure internal returns(bool){
        
        return (_role!=RoleTypes.Unseen && _pokerKey==456);
    
    }
    
    function numSurvive() view returns(uint){
        
        return livingPlayers.length-1;
    
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
    
    event PlayerReady(uint numPlayers);
    event ShowHand(uint[2][] livingHand);
    event debug(uint i);
}