/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { ethers } from 'ethers';
import React ,{useState , useEffect} from 'react'
import BINOPTION from "../ABIs/BINOPTION.json";
import {  Getprices  } from './Pricefeed';
import { AiOutlineRise, AiOutlineFall } from 'react-icons/ai';

const BetCard = (props) => {
  const [prices, setprices] = useState([]);
  const [betinfo, setbetinfo] = useState({amount : '', longorshort : true, txhash : ''});

  useEffect(() => {
    pricesx();
  }, [props.isETHchosen]);

  const ETHchosen = props.isETHchosen ; //false if WBTC chosen
  // const CurrentAccount = props.CurrentAccount; Web3Provider(window.ethereum)
  


  const pricesx = ()=> {
      Getprices()
    .then((result) => {
      console.log(result,'dc');
      setprices(result);  
      console.log(prices,'state');

    }).catch((err) => {
      console.log(err);
    });
  }

  const amountchange = (event) => {
    let amount = event.target.value;
    if (JSON.parse(amount)){
      setbetinfo(prev => {
        return {...prev,amount : JSON.parse(amount)}
      }); 
    } else {
      alert("only numbers please");
    }
     
  }
  console.log(betinfo);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        alert("use dapp in metamask injected browser!");
        return;
      }
      
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
    
      const goerliChainId = "0x5"; 
      if (chainId !== goerliChainId) {
       console.log("You are not connected to the Goerli Test Network!");
       props.setchainnetwork(false)
      }else{
        props.setchainnetwork(true)
      }
  
      
      console.log("Connected", accounts[0]);
      props.setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
    
   }
  

  const newoption = async () => {
    connectWallet()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log('signer: ', signer);
    const BINOPTIONABI = BINOPTION;
    const BOcontractaddr = "0x201aA3679D977b77FDCFe28748eA34d48555b892";
    const BOcontract = new ethers.Contract(BOcontractaddr,BINOPTIONABI,signer)
    // console.log('BOcontract: ', BOcontract);

    let amount = betinfo.amount;
    !betinfo.amount && alert('stake atleast 1 cent')
    amount > 10000 && alert("maximum stake only $10,000")
    
    if (amount !== 0 && amount < 10000 ) {
      try {
        
        let instrument = ETHchosen ? 0 : 1 ;
        let amountinwei = (amount * 1e18/ prices[0]).toFixed(0);
        console.log('amountinwei: ', amountinwei);
        let longorshort = betinfo.longorshort;
        if (JSON.parse(amountinwei) !== 0) {
          const txn = await BOcontract.writeOption(instrument,amountinwei,longorshort,{value: amountinwei});
          console.log('txn: ', txn);
          setbetinfo(prev => {return{...prev , txhash : txn.hash}});
          let receipt = await txn.wait();
          // setbetinfo(prev => {
          //   return {...prev}
          // }); 
          console.log('receipt: ', receipt);
        }
        

        
      } catch(error) {
        console.log('error: ', error.code);
        error.code !== 'UNSUPPORTED_OPERATION' && alert(error.code);
        //  setbetinfo(prev => {
        //   return {...prev}
        // }); 
      }
    }
  }



  return (
    <div className="betcardcontainer">

      <h4> {ETHchosen ? "1 ETH :" : '1 BTC : '} <span className="liveprice">{ETHchosen ? `$ ${prices[0]}` : `$ ${prices[1]}`}</span> </h4>
      {/* <h3 className="user">account : { props.CurrentAccount ? `${CurrentAccount.slice(0,5)}...${CurrentAccount.slice(-4)}` : ' connect wallet'}</h3> */}
      <div className="betinfo">
          <form action="">
          <label htmlFor="">stake : </label>
            <input type="text" onChange={amountchange} placeholder='$'/>
          </form>

          <div className="longorshort">
            <button className="long"  onClick={() => {
                  setbetinfo(prev => {return {...prev,longorshort : true}}); 
                  newoption() 
                }}>
                LONG <AiOutlineRise className='rise'/>
            </button>
            <button className="short" onClick={() => {
                  setbetinfo(prev => {return {...prev,longorshort : false}}); 
                  newoption()
                }}>
                SHORT <AiOutlineFall className='fall'/>
            </button>
          </div>
      </div>

      {/* <div className="writeoption">
          <button onClick={newoption}>NEW OPTION</button>
      </div> */}
      { betinfo.txhash &&
      <div className="txhash">
          <h3 className="txhashh3"><a target="_blank" rel="noreferrer" href={`https://goerli.etherscan.io/tx/${betinfo.txhash}` }>view on etherscan</a></h3>
      </div>}

    </div>
  )
}

export default BetCard;