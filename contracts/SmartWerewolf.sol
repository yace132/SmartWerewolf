pragma solidity ^0.4.19;
//pragma experimental ABIEncoderV2;
contract SmartWerewolf {//沒有constructor
    Player[] public players;
    uint[] MPC;
    uint[] public deck;
    uint n;
    uint p = 13;// TODO: mental poker用的group
    uint G = 0x123;// TODO: generator
    mapping (address => uint) playerNumOf;
    mapping(uint => uint) public roleOf;// 每個腳色的牌長哪樣, 固定的對照表
    mapping(uint => uint) public living;
    string public winner;
    //副詞之後放 
    //Time gameClock;
    
    /*1. 集合玩家*/
    function engagement(address[] _players) public {//oracle幫玩家登錄
    //internal | external , 一定要寫 , public 是 default
        require(_players.length >= 6);//規則是至少6人(uninform majaroty v.s. informed minorty)
        n = _players.length;
        players.length = 1+ n;//常常注意array的長度
        uint i;
        for (i = 0; i < n; i++) {
            players[i+1] = Player
            (
                {
                    id: _players[ i ],  
                    live: true, 
                    hand: 0, 
                    role: RoleTypes.Unseen,//記得加enum的type
                    pokerKey: 0
                }
           ); 
        //從1開始編號
        playerNumOf[_players[i]] = (i+1);
        /* 備用: players.push(_players[i]);
        
        live[ _players[i] ] = true;*/
            //event之後再加 emit JoinGame(i+1, players[i+1].id);
        }
        living[uint(RoleTypes.Werewolf)]=2;
        living[uint(RoleTypes.Seer)]=1;
        living[uint(RoleTypes.Villager)]=n-3;
        //event之後再加 emit PlayerReady(n/*, _players*/);
    }
    
    /*2-1 印製牌*/
    /*(a) 印牌面*/   
    function createCards() public {
        MPC.length = deck.length = 1+n;
        for(uint i=0; i <= n; i++ ){
            prepareDeck(i);// TODO: need to be implemented
        }
        //以下這種寫法要小心deck長度不夠的情況(前面require有規定了玩家的數量)
        deck[0] = G**MPC[ 0 ];
        roleOf[deck[0]]=uint(RoleTypes.Unseen);//只是方便, 應該是本來的Ambitious card
        
        deck[1] = G**MPC[ 1 ];
        roleOf[deck[1]]=uint(RoleTypes.Werewolf);
        
        deck[2] = G**MPC[ 2 ];
        roleOf[deck[2]]=uint(RoleTypes.Werewolf);
        
        deck[3] = G**MPC[ 3 ];
        roleOf[deck[3]]=uint(RoleTypes.Seer);
        
        for (uint j = 4; j <= n; j++) {
            deck[ j ] = G**MPC[j];
            roleOf[deck[j]]=uint(RoleTypes.Villager);
        }
        // TODO: 腳色應該獨立出來, 放在合約裡( mapping )。 modifier 檢查腳色是不是事先規定好的
        //event之後再加 emit CardReady(2, 1, n-3);  
        
    }
    
    /* TODO:(b)洗牌、印製牌背 */   
    function shuffleCards() public {// TODO: need to be implemented
        uint printBack = 0x777; //用來代表所有人key的乘積
        for(uint i=0; i<=n; i++){//模擬加密
            deck[i] = deck[i]** printBack;
        }

        //模擬permutation
        //
        uint tmp = deck[2];//不是complex types的會在stack裡
        deck[2] = deck[5];
        deck[5] = tmp;
        //event之後再加 emit CardShuffled();
    } 

    /* TODO: 2-2. 發牌 */
    //目前是照順序發
    //TODO: need to be implemented
    function dealCards() public {
        for(uint i=1; i<=n; i++){
            players[i].hand = deck[i];//可能有一邊有點多餘
            /*TODO: 這種寫法牌會被看光, 改成
            mapping(uint => CardTypes) roleOf;// 每個腳色的牌長哪樣, 固定的對照表
            uint[] deck;// 牌現在的狀態, 可能是面朝上或朝下
            function faceDown(uint[] storage deck){//passed by reference

            }
            function shuffle(uint[] storage deck){

            }*/ 
        }
        helpDecryptRole();//TODO: need to be implemented
        
        //event之後再加 emit GameReady();
        //gameClock.phase=GameIs.Ready;
        //itsNight();
    }

    function nightKill(address victimName, uint proofCanKill) public {
        //理想: 殺人(不公布死者) -->(進入白天) 公開死者 --> 人死亡
        //殺人、人死亡、公布死者
        //簡化的版本
        //完整的版本死者應該要先commit再open

        //parity 無法換行
        //werewolf丟給一個oracle, 由oracle發布交易?
        uint v = playerNumOf[victimName];//mapping element can't move to memory???
        Player memory victim = players[v];
        require (verify(proofCanKill, victim)==true);//Contract( or moderator) verify proof automatically
        //加入死亡的名單?
        //event之後再加 emit NightEnd("Werewolves, close your eyes.");
        //itsDay(victimName);
        killed(victimName);
    }
    
    function dayVoting(address name) public {
        killed(name);
    }

    function openRole(RoleTypes _role, uint _pokerKey) public {//活人不能公布身分(O)
        //死人可以重複公開身分，需要額外的state來防止，不過沒差
        //Card Opening by ZKP or 直接公布鑰匙(殺手遊戲似乎可以, 因為一人只有一張)
        require(verifyRole(_role, _pokerKey)==true);//Contract( or moderator) verify automatically
        uint i = playerNumOf[msg.sender];
        players[i].role = _role;
        players[i].pokerKey=_pokerKey;//公開自己的key會影響其他人的隱私嗎?
        living[uint(_role)]--;
        if(living[uint(RoleTypes.Werewolf)]==living[uint(RoleTypes.Seer)]+living[uint(RoleTypes.Villager)]){
            winner = "Werewolves";
        }
        else if(living[uint(RoleTypes.Werewolf)]==0){
            winner = "Humans";
        }
        
        /*
        if(gameClock.phase==GameIs.CheckingDayDead){
            gameClock.phase=GameIs.Day;
            itsNight();
        }
        else if(gameClock.phase == GameIs.CheckingNightDead){
            gameClock.phase=GameIs.Day;
        }
        */
    }

    function prepareDeck(uint i) internal {// TODO: need to be implemented
        //assert( MPC.length >= 1+i );
        MPC[ i ] = i ;
    }
    
    function helpDecryptRole() internal {
        for(uint i=1; i<=n; i++)
        players[i].hand++;//TODO: need to be implemented
        //++模擬解密的動作
        //解密到剩最後一層當手牌
    }
    
    /*function collectStatements()public view returns(KillConditions){
        //TODO: need to be implemented. 只是示意
        KillConditions memory statements;//放memory會有問題嗎?
        statements.iAmWerewolf = 1;//TODO: some encoding of states
        //出示狼人牌(不用證明他是誰?或許要證明他是玩家,先不考慮)
        statements.iAmLive=1;//TODO: some encoding of states
        statements.victimLive=1;//TODO: some encoding of states
        //我們是玩家,我們都活著
        return statements;
    }*/

    /*function encodeProof(KillConditions statements)public view returns(uint){
        //uint code = 0x144;
        return 0x144;//TODO: need to be implemented. 只是示意, 假設證明
        //assume proof is uint256 !!!
    }*/

    function verify(uint proofCanKill, Player victim) pure internal returns(bool){
        
        return proofCanKill == 123 && victim.live == true;//TODO: need to be implemented. 只是示意, 假設證明
    }


    //function itsNight() internal{
        //event之後再加 emit NightComming("Close your eyes!",
            //"Werewolves, open your eyes",
            //"Werewolves, pick someone to kill!");
        //gameClock.day++;
        //gameClock.phase = GameIs.Night;
    //}
    
    //function itsDay(address victimName) internal{
        //event之後再加 emit DayComming("Everybody open your eyes; it's daytime!");    
        //gameClock.day++;
        //gameClock.phase = GameIs.Day;
        //killedWhen(GameIs.Night, victimName);
        //event之後再加 emit SentenceToDeath("And you have been torn apart by werewolves!", victimName);
        //先殺再公告, 避免在看到event之後搶先發言
    //}

    function killed(/*GameIs t,*/ address name) internal{
        uint i = playerNumOf[name];
        players[i].live=false;//禁言
        /*
        if(t==Night){
            gameClock.phase = GameIs.CheckingNightDead;//等他公布身分
        }
        else if(t==Day){
            gameClock.phase = GameIs.CheckingDayDead;
        }
        */
        //else 違反規則如何?
        /*not open:罰錢 open:遊戲繼續*/
    }

    function verifyRole(RoleTypes _role, uint _pokerKey) pure internal returns(bool){
        return (_role!=RoleTypes.Unseen && _pokerKey==456);//TODO: need to be implemented. 只是示意, 假設證明
    }
    
    /* off-chain?
    function TalkingAndVoting() view{

    }
    */


    //enum GameIs{NotReady, Ready, Night, Day}
    enum RoleTypes{/*AmbitiousCard*/Unseen, Werewolf, Seer, Villager}
    //enum PlayersAre{CheckingTheDead, DiscussingAndVoting/*...*/}
    //不要分號
    struct Player{
        address id;
        bool live;
        //備用:uint pokerKey;
        uint hand;
        RoleTypes role;
        uint pokerKey;
    }

    /*struct Card{
        uint face;//牌面
        uint back;//牌背
        //多餘? CardTypes role;
    }*/
    
    struct KillConditions{
        uint iAmWerewolf;
        //statement1
        //players[i].hand = cardWerewolf1 ** players[i].pokerKey|| 
        //players[i].hand = cardWerewolf2 ** players[i].pokerKey
        //private input: hand, pokerKey
        //hand --> 匿名的需求
        //cardWerewolf1, cardWerewolf2 --> constant
        // (h) = C1 ** (k) 證明某人是某人的離散對數
        //把h當公鑰, k當私鑰 
        
        uint iAmLive;
        //statement2
        //(address) = livePerson1 or livePerson2 or ...
        // (i) = L1 or L2 or ... 
        //可以用playerNum
        
        //statement3
        //hand 要跟 address 或 i 對應
        //合一個ZKP, 同樣的input對好幾個output?
        
        uint victimLive;
        //v = L1 or L2
        //在簡化的版本這個condition不需要ZKP
    }
    
    /*先不要有絕對時間，假設大家會自己做
    struct Time{
        GameIs phase;//day or night?
        uint day;//what day?
        PlayersAre playerEvent;
    }*/

    //副詞最後再放
    //event StartGame(uint numPlayers);
    //event JoinGame(uint playerNum, address id);
    //event PlayerReady(uint numPlayers/*, address[] players*/);
    //event CardReady(uint numWerewolves, uint numSeer, uint numVillagers);
    //event CardShuffled();
    //event GameReady();
    //event NightComming(string moderatorSays,string moderatorSays_,string moderatorSays__);
    //event NightEnd(string moderatorSay);
    //event DayComming(string moderatorSays);
    //event SentenceToDeath(string moderatorSays,address moderatorIndicates);
    /*modifier before(uint T){
        require(T>0 && block.number<T);
        _;
    }

    modifier after(uint T){
        require(T>0 && block.number>T);
        _;
    }*/
    //modifier onlyPlayers and 保證遊戲依序執行
    
    /* 形容詞最後在放 modifier afterPlayerReady{
        assert(n >= 6
            && players.length >= 1+n);
        _; 
    }

    modifier afterCardReady{
        assert(n >= 6
            && deck.length >= 1+n);
        _; 
    }

    modifier afterDay{
        assert((gameClock.day==0 && gameClock.phase==GameIs.Ready)||
            (gameClock.day>0 && gameClock.phase==GameIs.Day));
        _; 
    }

    modifier onlyNight{
        assert(gameClock.day>0 && gameClock.phase==GameIs.Night);
        _;
    }
    
    modifier afterNight{
        assert((gameClock.day>0 && gameClock.phase==GameIs.Night));
        _; 
    }

    modifier onlyDay{
        assert(gameClock.day>0 && gameClock.phase==GameIs.Day);
        _;
    }
    
    modifier onlyKilled{
        assert(gameClock.day>0 && 
            (gameClock.phase==GameIs.CheckingNightDead|| gameClock.phase==GameIs.CheckingDayDead) && 
            players[playerNumOf[msg.sender]].live == false &&
            players[playerNumOf[msg.sender]].role == Unseen &&
            players[playerNumOf[msg.sender]].pokerKey == 0
        );
        _;
    } */

}