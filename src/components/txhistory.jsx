/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */


import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ethers } from 'ethers';
import BINOPTION from "../ABIs/BINOPTION.json";
import  {useState , useEffect} from 'react'
import Web3 from 'web3';
import { Getprices } from './Pricefeed';
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from 'react-icons/fa';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


export default function BasicTable(props) {

  const [accountdetails, setaccountdetails] = useState({account :'', totaloptions : ''});
  const [betsinfo, setbetsinfo] = useState([]);
  const [loading, setloading] = useState(true); 
  
  useEffect(() => {
    
    getaccountdata()
    setaccountdetails(prev => {return { ...prev , account : props.CurrentAccount}})
  }, [props.CurrentAccount]);

  const getaccountdata = async () => {

    const provider = new ethers.providers.JsonRpcProvider(`https://rpc.ankr.com/eth_goerli`);
    const BOcontractaddr = "0x201aA3679D977b77FDCFe28748eA34d48555b892";
    const url = 'https://ethereum-goerli-rpc.allthatnode.com';
    const web3 = new Web3(url);

    const BOcontract = new ethers.Contract(BOcontractaddr, BINOPTION, provider);

    let CurrentAccount =  web3.utils.toChecksumAddress(props.CurrentAccount)
    const optionstotal = parseInt(await BOcontract.getaccountoptionslength(CurrentAccount));
    setaccountdetails(prev => {return { ...prev , totaloptions : optionstotal}})
    let prices = await Getprices();

    let betinfosarray = [];
    
    for (let i = optionstotal - 1; i > -1; i--) {
      let betinfo = await BOcontract.Accountbets(CurrentAccount,i);

      let betinfoclean = {
        optionno : parseInt(betinfo[0]), 
        instrument : parseInt(betinfo[1]),
        stake : parseInt(parseInt(betinfo[2])),
        strike : parseInt(betinfo[3]),
        ethprice: JSON.parse(prices[0]),
        opendedat : parseInt(betinfo[4]),
        expiredat : parseInt(betinfo[5]),
        reward : parseInt(betinfo[6]),
        status : parseInt(betinfo[7]),
        direction :betinfo[8] 
      }

      
      betinfosarray.push(betinfoclean);
    }
    console.log('betinfosarray: ', betinfosarray);
    setbetsinfo(betinfosarray);
    setloading(false);
    console.log(betsinfo);
  }

  function secondsToDhms(t) {
    var myDate = new Date( t *1000);
    let x = myDate.toLocaleString()

    return x.slice(0,17) ;
  }

  function secondsToh(seconds) {
    seconds = Number(seconds);
    var h = Math.floor(seconds % (3600*24) / 3600);
    var hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") : "";
    return hDisplay ;
  }

  const settleoption = async (id) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const BOcontractaddr = "0x201aA3679D977b77FDCFe28748eA34d48555b892";
    const BOcontract = new ethers.Contract(BOcontractaddr, BINOPTION, signer);
    console.log(id);
    try {
      const closeoption = await BOcontract.settleOption(JSON.stringify(id));
      console.log(closeoption);
      let receipt = await closeoption.wait();
      console.log('receipt: ', receipt);
      getaccountdata();
    } catch(error) {
      error.code == 4001 && alert("rejected")
      alert('action rejected by user or the option can be closed only after 90 minutes of opening');
    }
    
  }

  const statushelper = (i,r) => {
    let x = (r / 1e21).toFixed(2)
    if(i == 2){return '+ ' + x}else if(i == 3){ return 'loss'}else{ return '-NA-'}
  }

  return (
    <>
      <div className="txhistoryheader">
            <h3> my positions</h3>
            <button className="refreshmypositions" onClick={getaccountdata}>refresh</button>
      </div>
      <div className='tablecontainer'> 
      { betsinfo.length ?
        <TableContainer component={Paper} className='TableBody'>
          <Table sx={{ minWidth: 300 }} aria-label="simple table">
            <TableHead >
              <TableRow className='Tablerow'> 
                <TableCell className='theadcells'>option/no.</TableCell>
                <TableCell align="right">instrument</TableCell>
                <TableCell align="right">staked ⧫</TableCell>
                <TableCell align="right">strikedat $</TableCell>
                <TableCell align="right">direction</TableCell>
                <TableCell align="right">openat</TableCell>
                <TableCell align="right">hours holded</TableCell>
                <TableCell align="right">PnL (DAI)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='TableBody'>
              {betsinfo?.map((row,i) => {
                let y = statushelper(row.status,row.reward);
                return(
                <TableRow
                  key={row.optionno}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } } }
                  className={y === 'loss' ? 'rowloss' : (y === '-NA-' ? 'rowopen' : 'rowwon') }
                >
                  <TableCell component="th" scope="row">{row.optionno}</TableCell>
                  <TableCell align="right">{!row.instrument ? 'ETH/USD' : 'BTC/USD'}</TableCell>
                  <TableCell align="right">{(row.stake * 1e-18).toFixed(4)} eth</TableCell>
                  <TableCell align="right">$ {(row.strike * 1e-8).toFixed(2)}</TableCell>
                  <TableCell align="right" >
                  {/* //{row.direction ? `long` : "short"} className={row.direction ? `dirlong` : "dirshort"}*/}
                     {row.direction ? <FaArrowAltCircleUp className='dirlong'/> : <FaArrowAltCircleDown className='dirshort'/>}
                  </TableCell>
                  <TableCell align="right">{secondsToDhms( row.opendedat)}</TableCell>
                  <TableCell align="right">{row.expiredat ? secondsToh(row.expiredat - row.opendedat) : 
                        <button className='closeoption' onClick={() => settleoption(betsinfo.length - 1 - i)}>close</button> }
                  </TableCell>
                  <TableCell align="right">{y}
                  </TableCell>
                </TableRow>)
              })}
            </TableBody>
          </Table>
        </TableContainer> 
        : 
        <h2> 
          {loading ? 
          <Box sx={{ width: '85.5%' }}>
              <LinearProgress />
          </Box> : 
          "no positions yet"}
        </h2>
        }
      </div>
    </>
  );
}



//http://goerli.blockscout.com
//https://ethereum-goerli-rpc.allthatnode.com
// const geteventdata = async (a) => {
//     const provider = new ethers.providers.JsonRpcProvider(`https://ethereum-goerli-rpc.allthatnode.com`);
//     const BOcontractaddr = "0x3731592bE4DEC5EEe5E54E050f280256B14598d2";

//     const BOcontract = new ethers.Contract(BOcontractaddr, BINOPTION, provider);
// }


// function secondsToDhms(seconds) {
//   seconds = Number(seconds);
//   var d = Math.floor(seconds / (3600*24));
//   var h = Math.floor(seconds % (3600*24) / 3600);
//   var m = Math.floor(seconds % 3600 / 60);
//   var s = Math.floor(seconds % 60);
  
//   var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
//   var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
//   var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
//   var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
//   return dDisplay + hDisplay + mDisplay + sDisplay;
//   }
