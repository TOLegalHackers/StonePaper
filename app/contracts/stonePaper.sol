pragma solidity ^0.4.2;
//contract tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token); }

contract StonePaper {


    /* Public variables of the token */
    string public standard = 'Token 0.2';
    string public name = "Stone Paper";

    address public godUser = 0x0;

  /* The token that hold all the data */
   struct Paper{
       string name; //Document Name
       bytes32 sig; //Hash of Document and Signiture
       uint256 database; // Number to identify the URL of the site which hold the data
       uint time; // Time the document was created
       address creator; // Creator of said document
       address lawyer; // Lawyer who authorized said document
       uint256[] meta; // All Meta data for document
   }


   uint16 numberOfAdmins;

   struct AdminAddVote{
       address creator;
       address newSupervisor;
       uint16 voteYes;
       uint16 voteNo;
       uint time;
       bool resolved;
       bool deathOrBirth;
       mapping (address => bool) alreadyVoted;

   }

   AdminAddVote[] public currentVotes;


    /* All of the Dictionary's with info */
    Paper[] public papers;
    mapping (address => uint256[]) public briefcase;
    mapping (address => string) public lawyerList;
    mapping (uint256 => string) public metaList;
    mapping (uint256 => string) public databaseList;
    mapping (address => bool) public superVisor;
    mapping (uint256 => mapping(address => bool)) public publicMeta;
    mapping (uint256 => bool) public isPublic;
    mapping (uint256 => uint256[]) public metaDatabase;


    /* This generates a public event on the blockchain that will notify clients */
    event PaperAdded(address indexed lawyer, string text, uint256 indexed metaI, uint256 meta );
    event LawyerAdded(address indexed id, string lawyer);
    event LawyerEdit(address indexed id, string lawyer);
    event DatabaseAdded(uint256 indexed id, string database);
    event DatabaseEdit(uint256 indexed id, string database);


    event ThereIsANewVote(address newSupervisor, address motionMadeBy,bool deathOrBirth, uint256 index);
    event NewSupervisor(address newSupervisor);
    event RemovedSupervisor(address oldSupervisor);


    function getGod() constant returns ( address god){
      god=godUser;
    }




    //Assign the lawyer's name in plaintext to a wallet

    function assignLawyer(string name){
        if (bytes(lawyerList[msg.sender]).length == 0){
            lawyerList[msg.sender]=name;
            LawyerAdded(msg.sender,name);
        }else{
            throw;
        }
    }


    //Edit the lawyer's name in plaintext, a notification will be sent through the system to all users

    function editLawyer(string name,address lawyer){
         if (superVisor[msg.sender]==true){
            lawyerList[lawyer]=name;
            LawyerEdit(lawyer,name);
         }else{
             throw;
         }
    }

    // Return the text of the Lawyer in plaintext

    function getLawyer(address lawyer) constant returns (string) {
        return lawyerList[lawyer];
    }

    // Assign url to database, the database will be owned by whoever creates the database

    function assignDatabase(string url, uint256 database){
        if (bytes(databaseList[database]).length==0){
            databaseList[database]=url;
            DatabaseAdded(database,url);
        }else{
            throw;
        }
    }

    //Edit the url of the database can only be accomplished by the superVisor

    function editDatabase(string url, uint256 database){
         if (superVisor[msg.sender]==true){
            databaseList[database]=url;
            DatabaseEdit(database,url);
         }else{
             throw;
         }
    }

    // Return the url of the database

    function getDatabase(uint256 database) constant returns (string){
        return databaseList[database];
    }


    // Assign a text description to a meta tag allowing the user to own it
    function assignMeta(string name, uint256 meta){
        if (bytes(metaList[meta]).length==0){
            metaList[meta]=name;
            publicMeta[meta][msg.sender]=true;
        }else{
            throw;
        }
    }

    /* Add another user able to apply a private meta tag */

    function addUserToMeta(address newUser, uint256 meta){
        if (publicMeta[meta][msg.sender]==true){
            publicMeta[meta][newUser]=true;
        } else {
            throw;
        }

    }

    /* Allow the Meta Tag to be used by all users. Can only be done by the meta tag owner */

    function makeMetaPublic(uint256 meta, bool newState){
        if (publicMeta[meta][msg.sender]==true){
            isPublic[meta]=newState;
        } else {
            throw;
        }

    }

    /* Edit the description of a meta tag can only be done by the meta tag creator */

    function editMeta(string text, uint256 meta){
        if (publicMeta[meta][msg.sender]==true){
            metaList[meta]=text;
        } else {
            throw;
        }
    }

    /* Return the English description of a meta tag */

    function getMeta(uint256 meta) constant returns (string){
        return metaList[meta];
    }




    /* Test Meta*/
    function testMeta(uint256 _index) constant returns ( bool result){

        if (isPublic[_index]){

            return true;
        } else {
            return publicMeta[_index][msg.sender];
        }

    }

    /* Initializes Create a New Paper

    nameI = The name of the document in planetext
    signI = the hash of the document
    databaseI = the database where the data is stored
    metaI = all metaData to attach to the Paper
    lawyerI = the lawyer who has added the document

    */
    function createPaper(
       string nameI,
       bytes32 signI,
       uint256 databaseI,
       uint256[] metaI,
       address lawyerI
        ) {

            for(uint x = 0; x <metaI.length; x++) {
                if (!testMeta(metaI[x])){
                    throw;
                }
            }

        uint256 theIndex = papers.length;
        papers.push(Paper(nameI,signI,databaseI,now,tx.origin,msg.sender,metaI));

        for(x = 0; x <metaI.length; x++) {
                metaDatabase[metaI[x]].push(theIndex);
                PaperAdded(lawyerI, nameI,metaI[x],metaI[x]);
        }

        briefcase[msg.sender].push(theIndex);

    }

    /* Copy data to another user Account
    _to the address where the data should go
    _index the index of the document

    */

    function copyPaper(address toI, uint256 indexI){
        if ( briefcase[msg.sender].length < indexI){
            briefcase[toI].push(briefcase[msg.sender][indexI]);
        }else {
            throw;
        }
    }

    /* Get's the paper in a readable format
    indexI = the index of the paper
    RETURN
    name = name of the doc
    sig = the hash of the document
    database = the database where the document is stored
    time = the time the doc was created
    creator = who created the document
    lawyer = the lawyer who authenticated the document

    */

    function getPapers(uint256 indexI) constant returns (
        string name,
       bytes32 sig,
       uint256 database,
       uint time,
        address creator,
        address lawyer){

        Paper data  = papers[briefcase[msg.sender][indexI]];
        sig=data.sig;
        name=data.name;
        database=data.database;
        time = data.time;
        creator = data.creator;
        lawyer = data.lawyer;



    }


    /* Get's the paper in a readable format
    metaI = the metadata required
    indexI = the index of the metadata in the array

    RETURN
    name = name of the doc
    sig = the hash of the document
    database = the database where the document is stored
    time = the time the doc was created
    creator = who created the document
    lawyer = the lawyer who authenticated the document

    */


    function getPaperFromMeta(uint256 metaI, uint256 indexI) constant returns (
      string text,
      bytes32 sig,
      uint256 database,
      uint time,
      address creator,
      address lawyer){
    Paper data = papers[metaDatabase[metaI][indexI]];
    sig=data.sig;
    text=data.name;
    database=data.database;
    time = data.time;
    creator = data.creator;
    lawyer = data.lawyer;
    }

    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
    }


    function addSupervisor(address newSuper){
        if (godUser == 0x0){
            godUser = msg.sender;
            superVisor[msg.sender]=true;
            numberOfAdmins=numberOfAdmins+1;
            return;
        }

        if (godUser == msg.sender){
            if (superVisor[newSuper]!=true && numberOfAdmins < 5){
            superVisor[newSuper]=true;
            numberOfAdmins=numberOfAdmins+1;
            return;
            }
        }

        if (superVisor[msg.sender]==true){
            if (superVisor[newSuper]!=true){
              currentVotes.push(AdminAddVote(msg.sender,newSuper,0,0,now,false,true));
              ThereIsANewVote(newSuper,msg.sender,true,currentVotes.length-1);
            } else {
                throw;
            }
        } else{
            throw;
        }
    }


    /*

        function resolveSupervisorVote(uint256 index){
            if (currentVotes[index].creator != msg.sender){
                if (currentVotes[index].time != now  - (48 hours)){
                    if (currentVotes[index].resolved == false){
                        if (currentVotes[index].voteYes>currentVotes[index].voteNo){
                            if (currentVotes[index].deathOrBirth==false){
                                superVisor[currentVotes[index].newSupervisor]=false;
                                numberOfAdmins=numberOfAdmins-1;
                                NewSupervisor(currentVotes[index].newSupervisor);
                            }else{
                                superVisor[currentVotes[index].newSupervisor]=true;
                                numberOfAdmins=numberOfAdmins+1;
                                RemovedSupervisor(currentVotes[index].newSupervisor);
                            }
                        } else {
                            currentVotes[index].resolved = true;
                        }
                    } else {
                        throw;
                    }
                } else {
                    throw;
                }
            } else {
                throw;
            }
        }

        function supervisorVote(uint256 index, bool vote){
            if (superVisor[msg.sender]!=true ){
             throw;
            }

            if (index<currentVotes.length){
                if (currentVotes[index].alreadyVoted[msg.sender]!=true){
                    currentVotes[index].alreadyVoted[msg.sender]=true;
                    if (vote){
                        currentVotes[index].voteYes++;
                    }else{
                        currentVotes[index].voteNo++;
                    }
                }

            }else{
                throw;
            }
        }




        function removeSupervisor(address oldSuper){
            if (godUser == 0x0){
                godUser = msg.sender;
                superVisor[msg.sender]=true;
                numberOfAdmins=numberOfAdmins+1;
            }

            if (godUser == msg.sender){
                if (superVisor[oldSuper]==true && numberOfAdmins < 5){
                superVisor[oldSuper]=false;
                numberOfAdmins=numberOfAdmins-1;
                return;
                }
            }

            if (superVisor[msg.sender]==true){
                if (superVisor[oldSuper]!=true){
                  currentVotes.push(AdminAddVote(msg.sender,oldSuper,0,0,now,false,false));
                  ThereIsANewVote(oldSuper,msg.sender,false,currentVotes.length-1);
                } else {
                    throw;
                }
            } else{
                throw;
            }
        }



    */






}
