// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the interface we defined in the previous step.
// This ensures our contract adheres to the ERC20 standard.
import "./IERC20.sol";

// Define the main contract, indicating that it implements the IERC20 interface.
contract XYZCoin is IERC20 {

    // --- State Variables ---

    string public name = "XYZ Coin";
    string public symbol = "XYZ";
    uint8 public decimals = 0;
    uint256 private _totalSupply = 1000;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowed;

    // --- Constructor ---

    constructor() {
        // Assign the total supply of tokens to the contract creator (the address that deploys it).
        balances[msg.sender] = _totalSupply;
        // Emit a Transfer event to signify the "minting" of the tokens,
        // from the zero address to the creator's address.
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    // --- Read-Only Functions ---

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return balances[account];
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return allowed[owner][spender];
    }

    // --- State-Changing Functions ---

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(balances[msg.sender] >= amount, "ERC20: transfer amount exceeds balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(balances[from] >= amount, "ERC20: transfer amount exceeds balance");
        require(allowed[from][msg.sender] >= amount, "ERC20: transfer amount exceeds allowance");
        balances[from] -= amount;
        balances[to] += amount;
        allowed[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }
}