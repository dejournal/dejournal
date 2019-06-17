pragma solidity >=0.4.17;

contract Dejournal {
  /*
  *  Events
  */
  event OwnershipTransferred(address indexed _previousOwner, address indexed _newOwner);
  event NewPaperStored(address indexed _hashSender, uint _hashId, string _hashContent, uint timestamp);
  event NewVersionStored(address indexed _hashSender, uint _hashId, uint _reference, string _hashContent, uint timestamp);
  event Withdrawn(address indexed _hashSender, uint amount);

  /*
  * Storage
  */

  struct Paper {
    // sender address
    address sender;
    // hash text
    string content;
    // creation timestamp
    uint timestamp;
    // other versions
    uint[] versions;
}

  // Papers mapping
  mapping(uint => Paper) public papers;
  // Contract owner
  address public owner;
  // Last stored Hash Id
  uint public lastPaperId;
  // Service price in Wei
  uint public price;

  /*
  * Modifiers
  */

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /*
  * Public functions
  */

  /**
  * @dev Contract constructor
  * @param _price Service price
  */
  constructor(uint _price) public {
    // check price valid
    require(_price > 0);

    // assign owner
    owner = msg.sender;
    // assign price
    price = _price;
    // init ids
    lastPaperId = 0;
  }

  /**
  * @dev Transfer contract ownership
  * @param _newOwner New owner address
  */
  function transferOwnership(address _newOwner) onlyOwner public {
    // check address not null
    require(_newOwner != address(0));

    // assign new owner
    owner = _newOwner;

    // Log event
    emit OwnershipTransferred(owner, _newOwner);
  }

  /**
  * @dev Withdraw contract accumulated Eth balance
  */
  function withdrawBalance() onlyOwner public {
    uint amount = address(this).balance;
    address payable ownerp = address(uint160(owner));

    // transfer balance
    ownerp.transfer(address(this).balance);

    // Log event
    emit Withdrawn(owner, amount);
  }

  /**
  * @dev save new paper
  * @param _hashContent Hash Content
  */

  function savePaper(string memory _hashContent) private returns (uint _paperId) {
    // create Hash
    uint paperId = ++lastPaperId;
    papers[paperId].sender = msg.sender;
    papers[paperId].content = _hashContent;
    papers[paperId].timestamp = block.timestamp;
    papers[paperId].versions.push(paperId);

    return(paperId);
  }


  /**
  * @dev saveNewPaper new hash
  * @param _hashContent Hash Content
  */
  function saveNewPaper(string memory _hashContent) payable public {
    // only save if service price paid
    require(msg.value >= price);

    // create Hash
    uint paperId = savePaper(_hashContent);

    // Log event
    emit NewPaperStored(papers[paperId].sender, paperId, papers[paperId].content, papers[paperId].timestamp);
  }

    /**
  * @dev saveNewVersion new version
  * @param _hashContent Hash Content, _reference Paper Reference
  */
  function saveNewVersion(string memory _hashContent, uint _reference) payable public {
    // only save if service price paid
    require(msg.value >= price);

    // find referred paper
    Paper memory originalPaper = papers[_reference];
    // first check if it's a valid reference
    require(originalPaper.sender != address(0) && bytes(originalPaper.content).length > 0 && originalPaper.timestamp > 0 );
    // check if the sender is the original author of the paper
    require(msg.sender==originalPaper.sender);
    // add new hash as new paper
    uint paperId = savePaper(_hashContent);
    // add references to other versions and add this version as new reference.
    papers[paperId].versions=papers[_reference].versions;
    //hashes[paperID].versions.push(paperID);
    // add this paperID to the reference paper versions array and all other versions
    for (uint i=0; i<papers[_reference].versions.length; i++) {
        papers[papers[_reference].versions[i]].versions.push(paperId);
    }
    // Log event
    emit NewVersionStored(papers[paperId].sender, paperId, _reference, papers[paperId].content, papers[paperId].timestamp);
  }

  /**
  * @dev find hash by id
  * @param _id Hash Id
  */

  function getPaperByID(uint _id) view public returns (address hashSender, string memory hashContent, uint hashTimestamp, uint hashNumVersions) {   
        return (papers[_id].sender,papers[_id].content, papers[_id].timestamp,papers[_id].versions.length); 
    }

    function getVersionByID(uint _paperId, uint _verId) view public returns (uint _version) {
        return papers[_paperId].versions[_verId];
    }

    function getLastPaperId() public view returns (uint _lastPaperId) {
        return lastPaperId;
    }
}
