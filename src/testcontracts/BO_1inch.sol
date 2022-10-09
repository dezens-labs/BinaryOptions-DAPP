// SPDX-License-Identifier: MIT

//  ETHUSD : 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
//  btcusd : 0xA39434A63A52E749F02807ae27335515BA4b07F7

pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract ETHPriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;
    constructor() {
        priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
    }
    function getLatestPrice() public view returns (int,uint,uint) {
        (uint roundId,int price,,uint updatedAt,) = priceFeed.latestRoundData();
        return (price,roundId,updatedAt);
    }
} 

contract BTCPriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;
    constructor() {
        priceFeed = AggregatorV3Interface(0xA39434A63A52E749F02807ae27335515BA4b07F7);
    }
   function getLatestPrice() public view returns (int,uint,uint) {
        (uint roundId,int price,,uint updatedAt,) = priceFeed.latestRoundData();
        return (price,roundId,updatedAt);
    }
}


contract BOptions {
    
    ETHPriceConsumerV3 eth = ETHPriceConsumerV3(0x73840Ce7155af3B092328BCccb528f8001d35917);
    BTCPriceConsumerV3 btc = BTCPriceConsumerV3(0x6Ec87417665741FFe69B7dAD96Dc358f0C7Fe72f);

    IERC20 public immutable DAI = IERC20(0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60);

    event Placebet(address player, bet indexed newbet);
    enum Status {nobet,beton,won,lost}
    enum Instrument {ETH,BTC}

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

  function GetEthprice() public view returns(int){
        (int price,,) = eth.getLatestPrice();
        return price / 1e6 ; 
    }

    function GetBtcprice() public view returns(int){
        (int price,,) = btc.getLatestPrice();
        return price / 1e6 ; 
    }
    
// returns a mutiplier like 1.8x (odds)
    function rewardmultiplier(uint _id, address _staker, uint totalhourdrop, uint pricechangedrop) public view returns(uint){
            
             // k and p are computed in front end and passes inside the settleoption() function.
            // k is a constant that depends on price change percentage when option expires, has three tiers of reward drops depending on the % price change.
            // p is a constant that depends on hours of your option expiry, drops the reward multiplier by 1 % every hour.
    
            uint k = pricechangedrop; 
            uint p = totalhourdrop;  

            bet[] memory betinfos = Accountbets[_staker];
            bet memory betinfo = betinfos[_id];
            // int strikeprice = betinfo.strikeprice;
        

            require(betinfo.expiry < block.timestamp && betinfo.betstatus == Status.beton);


            // int pricechange_percent = (latestprice - strikeprice) * 100 / latestprice;

            // uint hourspassed = (betinfo.timestamp - betinfo.expiry) / 3600 ; and for looping the rewarddrop of 1 % for no of hourspassed to get value of p, better to do with JS.
            // for every hour you will get droupped to 0.99x of your prev hour rewards, so for a option with expiry of 24 hours, you would have 0.7856x comparing to  option with < 1 hour expiry.
            

            // if (pricechange_percent < 1) {
            //     k = 2;
            // }else if(pricechange_percent >= 1 && pricechange_percent < 4) {
            //     k = 1.8;
            // }else {
            //     k = 1.6; 
            // if the instrument is volatile i.e; > 5% change within your expiration time, your return rate will go from 2x to 1.6x that is 60% gain, 
            // note that k will get multiplied by p that depends on hours of your expiration.
            // }

            return (k * p); // this will get multiplied with your staked amount, reward be like (1.74x * $100) if you win.
            
    }

    function placebet(Instrument instrument, uint amount, int strikeprice, uint expiry,uint slippage,bool longorshort) external payable {
        require( msg.value < (msg.sender).balance && 
                 (msg.value * uint(GetEthprice()/100)) >= (amount * slippage), //  slippage
                 "insuffficient eth, det some from faucet");

        uint timestamp = block.timestamp;
        uint optionexpiration = timestamp + expiry; 
        uint slippedamount = amount * slippage;
        // if (instrument == "ETH"){ int strikeprice = GetEthprice();} else { int strikeprice = GetBtcprice();}
         
        bet memory newbet = bet( Accountbets[msg.sender].length , instrument, slippedamount, strikeprice , timestamp, optionexpiration, Status.beton, longorshort);

        Accountbets[msg.sender].push(newbet);
    }

    function settleOption( uint id, uint totalhourdrop, uint pricechangedrop, int latestprice) external {
        bet[] memory mybets = Accountbets[msg.sender];

        require( mybets[id].betstatus == Status.beton && 
                    mybets[id].expiry > block.timestamp,
                    "cant settle the option now. didn't reach expiration yet");
        
        bet[] storage betinfos = Accountbets[msg.sender];
        bet storage betinfo = betinfos[id];
        
        bool wonorlost; // true if won

        if (betinfo.longorshort) {
            betinfo.strikeprice >= latestprice && !wonorlost; 
        }else {
            betinfo.strikeprice <= latestprice && !wonorlost; 
        }

        wonorlost ? betinfo.betstatus = Status.won : betinfo.betstatus = Status.lost ;

        uint gain = rewardmultiplier(id,msg.sender,totalhourdrop,pricechangedrop) * betinfo.stake ;

        bool txn_success = DAI.transfer(msg.sender,gain);
        require(txn_success,"withdrawal failed");
    }


}



// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
//   etherscan: {
//     apiKey: "B9SEZ4K5MAMTI9FEPDQRBIQP9GW4WN5GFG",
//   },
//   networks : {
//     goerli : {
//       url : "https://morning-proud-log.ethereum-goerli.discover.quiknode.pro/54ba1889078030f0d9e7e11cb49481298b031637/",
//       accounts : ["059bcd5d85e0f99074148e694668d244d90b98bc50bc1c8d4f26785741a5e4c9"],
//     }
//   }
// };


// {
//   "name": "binaryoptions-dapp",
//   "version": "0.1.0",
//   "private": true,
//   "dependencies": {
//     "@chainlink/contracts": "^0.5.1",
//     "@emotion/react": "^11.10.4",
//     "@emotion/styled": "^11.10.4",
//     "@mui/material": "^5.10.8",
//     "@nomicfoundation/hardhat-toolbox": "^2.0.0",
//     "@openzeppelin/contracts": "^4.7.3",
//     "@testing-library/jest-dom": "^5.16.5",
//     "@testing-library/react": "^13.4.0",
//     "@testing-library/user-event": "^13.5.0",
//     "ethers": "^5.7.1",
//     "react": "^18.2.0",
//     "react-dom": "^18.2.0",
//     "react-icons": "^4.4.0",
//     "react-scripts": "^2.1.3",
//     "sass": "^1.55.0",
//     "web-vitals": "^2.1.4",
//     "web3": "^1.8.0"
//   },
//   "scripts": {
//     "start": "react-scripts start",
//     "build": "react-scripts build",
//     "test": "react-scripts test",
//     "eject": "react-scripts eject"
//   },
//   "eslintConfig": {
//     "extends": [
//       "react-app",
//       "react-app/jest"
//     ]
//   },
//   "main": "lib/functions/src/index.js",
//   "browserslist": {
//     "production": [
//       ">0.2%",
//       "not dead",
//       "not op_mini all"
//     ],
//     "development": [
//       "last 1 chrome version",
//       "last 1 firefox version",
//       "last 1 safari version"
//     ]
//   },
//   "devDependencies": {
//     "hardhat": "^2.11.2"
//   },
//   "description": "This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.",
//   "directories": {
//     "test": "test"
//   },
//   "author": "",
//   "license": "ISC"
// }

// "@chainlink/contracts": "^0.5.1",
//     "@emotion/react": "^11.10.4",
//     "@emotion/styled": "^11.10.4",
//     "@mui/material": "^5.10.8",
//     "@nomicfoundation/hardhat-toolbox": "^2.0.0",
//     "@openzeppelin/contracts": "^4.7.3",
//     "@testing-library/jest-dom": "^5.16.5",
//     "@testing-library/react": "^13.4.0",
//     "@testing-library/user-event": "^13.5.0",
//     "ethers": "^5.7.1",
//     "react": "^18.2.0",
//     "react-dom": "^18.2.0",
//     "react-icons": "^4.4.0",
//     "react-scripts": "^2.1.3",
//     "sass": "^1.55.0",
//     "web-vitals": "^2.1.4",
//     "web3": "^1.8.0"