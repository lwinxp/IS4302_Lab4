pragma solidity ^0.5.0;
import "./Dice.sol";

contract DiceMarket {

    Dice diceContract;
    uint256 public comissionFee;
    address _owner = msg.sender;
    mapping(uint256 => uint256) listPrice;
     constructor(Dice diceAddress, uint256 fee) public {
        diceContract = diceAddress;
        comissionFee = fee;
    }


    //list a dice for sale. Price needs to be >= value + fee
    function list(uint256 id, uint256 price) public {
       require(msg.sender == diceContract.getPrevOwner(id), "Dice can only be listed by owner");
       require(price >= (diceContract.getDiceValue(id) + comissionFee), "list price must be higher than value and fee"); //offerred price meets minimum ask
       listPrice[id] = price;
    }

    function unlist(uint256 id) public {
       require(msg.sender == diceContract.getPrevOwner(id), "Dice can only be unlisted by owner");
       listPrice[id] = 0;
  }

    // get price of dice
    function checkPrice(uint256 id) public view returns (uint256) {
       return listPrice[id];
 }

    // Buy the dice at the requested price
    function buy(uint256 id) public payable {
       require(listPrice[id] != 0, "Dice can only be bought if it is listed"); //is listed
       require(msg.value >= (listPrice[id] + comissionFee), "buy price must be higher than price and fee"); //offerred price meets minimum ask

       address payable recipient = address(uint160(diceContract.getPrevOwner(id)));
       recipient.transfer(msg.value - comissionFee);    //transfer (price-comissionFee) to real owner
       diceContract.transfer(id, msg.sender);
    }

    function getContractOwner() public view returns(address) {
       return _owner;
    }

    function withDraw() public {
        if(msg.sender == _owner)
            msg.sender.transfer(address(this).balance);
    }
}
