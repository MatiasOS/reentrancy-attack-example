pragma solidity 0.6.4;

contract Propinas {
  mapping (address => uint) public balanceOf;

  constructor() payable public {
    sendTip(msg.sender);
  }

  function sendTip(address _address) payable public {
    balanceOf[_address] += msg.value;
  }

  function get() public {
    require(balanceOf[msg.sender] > 0, 'Balance is zero');
    msg.sender.transfer(balanceOf[msg.sender]);
    balanceOf[msg.sender] = 0;
  }

  receive() external payable {
    balanceOf[msg.sender] += msg.value;
  }

  function getBalanceOf(address _address) external view returns (uint) {
    return balanceOf[_address];
  }
}
