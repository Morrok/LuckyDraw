// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Decentralized Application Project
// 2220731303002 ว่าที่ร้อยตรีจารุภูมิ ชาลีสมบัติ
// Detail: Lucky Draw

import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract LuckyDraw is Ownable {
    mapping(uint256 => mapping(address => uint256)) public balances;
    mapping(uint256 => mapping(address => string)) public mappingAcctName;
    mapping(uint256 => address[]) public accounts;
    mapping(uint256 => WinerInfo) public winner;
    uint256 public currentRound = 0;

    struct WinerInfo {
        address value_address;
        string value_name;
    }

    event RegisterEvent(uint256 _round ,address indexed _from, uint256 _value);
    event TransferRewardEvent(uint256 _round ,address indexed _from, address indexed _to, uint256 _value);
    event TransferFeeEvent(uint256 _round ,address indexed _from, address indexed _to, uint256 _value);
    event ResetEvent(uint256 _round ,address indexed _from, address indexed _to, uint256 _value);

    function register(string memory accountName) public payable {
        require(bytes(accountName).length > 0, "Register name can't empty");
        require(msg.value == 0.05 ether, "Register sizes are restricted to 0.05 ether");
        require(balances[currentRound][msg.sender] == 0, "An address cannot register twice");
        accounts[currentRound].push(msg.sender);
        require(accounts[currentRound].length <= 6, "Can't register more than 6 account");
        balances[currentRound][msg.sender] = msg.value;
        mappingAcctName[currentRound][msg.sender] = accountName;
        emit RegisterEvent(currentRound, msg.sender, msg.value);
    }

    function accountCount() public view returns (uint256) {
        return accounts[currentRound].length;
    }

    function allAccount() public view returns (address[] memory) {
        return accounts[currentRound];
    }

    function adminTransfer(uint256 acctIndex) 
        public
        onlyOwner 
    {   
        address toAccount = accounts[currentRound][acctIndex];
        string storage toName = mappingAcctName[currentRound][toAccount];
        uint256 fee = address(this).balance * 30 / 100;
        uint256 reward = address(this).balance - fee;
        payable(toAccount).transfer(reward);
        emit TransferRewardEvent(currentRound, address(this), toAccount, reward);
        payable(owner()).transfer(fee);
        emit TransferFeeEvent(currentRound, address(this), owner(), fee);
        winner[currentRound] = WinerInfo(toAccount, toName);
        adminReset();
    }

    function adminReset() 
        public 
        onlyOwner
    {   
        if(address(this).balance > 0) {
            for (uint256 i = 0; i < accounts[currentRound].length; i++) {
                address toAccount = accounts[currentRound][i];
                uint256 balance = balances[currentRound][toAccount];
                payable(toAccount).transfer(balance);
                emit ResetEvent(currentRound, address(this), toAccount, balance);
            }
        }
        currentRound += 1;
    }
}

