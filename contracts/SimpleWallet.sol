pragma solidity >=0.4.25 <0.6.0;

contract SimpleWallet {
    
    address payable owner;
    
    struct WithdrawalStruct {
        address to;
        uint amount;
    }
    
    struct Senders {
        bool allowed;
        uint numTransactions;
        mapping(uint => WithdrawalStruct) withdrawals;
    }
    
    mapping(address => Senders) public isAllowedToSendMap;
    
    event Deposit(address _sender, uint _amount);
    event Withdrawal(address _sender, uint _amount, address _beneficiary);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized");
        _;
    }
    
    constructor() public {
        owner = msg.sender;
        allowToSend(msg.sender);
    }
    
    function depositEther() external payable  {
        require(isAllowed(msg.sender), "Unauthorized");
        emit Deposit(msg.sender, msg.value);
    }
    
    function sendFunds(uint amount, address payable receiver) public {
        require(isAllowed(msg.sender), "Unauthorized");
        receiver.transfer(amount);
        emit Withdrawal(msg.sender, amount, receiver);
        isAllowedToSendMap[msg.sender].withdrawals[isAllowedToSendMap[msg.sender].numTransactions].to = receiver;
        isAllowedToSendMap[msg.sender].withdrawals[isAllowedToSendMap[msg.sender].numTransactions].amount = amount;
        isAllowedToSendMap[msg.sender].numTransactions++;
    }
    
    function allowToSend(address _address) public onlyOwner {
        isAllowedToSendMap[_address].allowed = true;
    }
    
    function disallowAddressToSend(address _address) public onlyOwner {
        isAllowedToSendMap[_address].allowed = false;
    }
    
    function isAllowed(address _address) public view returns(bool){
        return isAllowedToSendMap[_address].allowed;
    }
    
    function getWithdrawal(address _address, uint _index) public view returns (address, uint) {
        return (isAllowedToSendMap[_address].withdrawals[_index].to, isAllowedToSendMap[_address].withdrawals[_index].amount);
    }
    
    function killWallet() public onlyOwner {
        selfdestruct(owner);
    }
}