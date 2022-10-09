import '../css/App.css';
import React, { useEffect, useState } from 'react';
import {  Getprices  } from './Pricefeed';
import BetCard from './BetCard';
import Navbar from './Navbar';
import BasicTable from './txhistory';
import Footer from './footer';

function App() {

  const [ethchosen, setethchosen] = useState(true);
  const [CurrentAccount, setCurrentAccount] = useState(undefined);
  const [chainnetwork, setchainnetwork] = useState(undefined);

  useEffect(() => {
   ETHchosen();
  }, []);

  const ETHchosen = () => {
    setethchosen(true);
    
  }

  const WBTCchosen = () => {
    setethchosen(false);
    
  }

  

  return (
    <div className="App">
      <header className="App-header">
      <Navbar setCurrentAccount={setCurrentAccount} setchainnetwork={setchainnetwork} chainnetwork={chainnetwork} CurrentAccount={CurrentAccount} />
      </header>

      <div className="Appbody">
        <div className="pairscontainer">
          <button className="pairbutton" onClick={ETHchosen}>
            ETH/DAI
          </button>
          <button className="pairbutton" onClick={WBTCchosen} >
            WBTC/DAI
          </button>
        </div>

        <div className="betcardcontainer">
          <div className="betcard">
              <BetCard isETHchosen = {ethchosen} CurrentAccount= {CurrentAccount} />
          </div>
        </div>

        <div className="txhistory">
          <BasicTable CurrentAccount= {CurrentAccount}/>
        </div>

      </div>

      <footer>
      </footer>

    </div>
  )
}
export default App;
