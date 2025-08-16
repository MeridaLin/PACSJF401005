pragma solidity >=0.5.1 <0.6.0;

// Renamed the contract to show it's the fixed version.
contract FixedVoting {
    mapping (address => uint26) public remainingVotes;
    uint256[] public candidates;
    address owner;
    bool hasEnded = false;

    modifier notEnded() {
        require(!hasEnded);
        _;
    }

    constructor(uint256 amountOfCandidates) public {
        candidates.length = amountOfCandidates;
        owner = msg.sender;
    }

    function buyVotes() public payable notEnded {
        require(msg.value >= 1 ether);
        remainingVotes[msg.sender] += msg.value / 1e18;
        msg.sender.transfer(msg.value % 1e18);
    }

    function vote(uint256 _candidateID, uint256 _amountOfVotes) public notEnded {
        require(_candidateID < candidates.length);
        require(remainingVotes[msg.sender] - _amountOfVotes >= 0);
        remainingVotes[msg.sender] -= _amountOfVotes;
        candidates[_candidateID] += _amountOfVotes;
    }

    // This function is now safe from re-entrancy attacks.
    function payoutVotes(uint256 _amount) public notEnded {
        // 1. Check: First, check if the user has enough votes.
        require(remainingVotes[msg.sender] >= _amount);

        // 2. Effect: IMPORTANT! Update the user's vote balance first.
        // This prevents the re-entrancy attack.
        remainingVotes[msg.sender] -= _amount;

        // 3. Interaction: After updating our state, send the ETH.
        msg.sender.transfer(_amount * 1e18);
    }

    function endVoting() public {
        require(msg.sender == owner);
        hasEnded = true;
        msg.sender.transfer(address(this).balance);
    }

    function displayBalanceInEther() public view returns(uint256 balance) {
        uint balanceInEther = address(this).balance / 1e18;
        return balanceInEther;
    }
}