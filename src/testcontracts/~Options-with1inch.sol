//// SPDX-License-Identifier: MIT

pragma solidity ^ 0.8.17;

import "f:/STUDY MATERIAL/js web3/sol projects/New folder/binaryoptions-dapp/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BOptions{
    // DAI on goerli 
      IERC20 public immutable DAI = IERC20(0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60);

    event Placebet(address player, bet indexed newbet);
    enum Status {nobet,beton,won,lost}
    enum Instrument {ETH,WBTC}

    struct bet {
        uint id;
        Instrument instrument;
        uint stake;
        int strikeprice;
        uint timestamp;
        uint expiry;
        Status betstatus; //enum
        bool longorshort; //true if long 
    }

    mapping (address => bet[]) public Accountbets;

    receive() external payable{}

   function withdrawDAI() external {
        require(msg.sender == 0x78351284f83A52b726aeEe6C2ceBBe656124434c ,"you arent the owner");
        DAI.transferFrom(address(this),msg.sender,DAI.balanceOf(msg.sender));
    }


}