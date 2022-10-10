// import { ethers } from "ethers";




// export const SwitchtoGOERLI = async () => {
        
//     const chainId = 5 // goerli testnet

//     if (window.ethereum.networkVersion !== chainId) {
//         try {
//             await window.ethereum.request({
//             method: 'wallet_switchEthereumChain',
//             params: [{ chainId: "0x5" }]
//             });
//         } catch (err) {

//             if (err.code === 4902) {
//             await window.ethereum.request({
//                 method: 'wallet_addEthereumChain',
//                 params: [
//                 {
//                     chainName: 'Goerli Testnet',
//                     chainId:  "0x5",
//                     nativeCurrency: { name: 'GoerliETH', decimals: 18, symbol: 'GoerliETH' },
//                     rpcUrls: ['https://rpc.ankr.com/eth_goerli','https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161']
//                 }
//                 ]
//             });
//             }
//         }
//         }
// }



// export const checkIfWalletIsConnected = async (props) => {
//     const { ethereum } = window;

//     if (!ethereum) {
//       console.log("Make sure you have metamask!");
//       return;
//     } else {
//       console.log("We have the ethereum object", ethereum);
//     }

//     const accounts = await ethereum.request({ method: 'eth_accounts' });

//     if (accounts.length !== 0) {
//       const account = ethers.utils.getAddress(accounts[0]);
//       console.log("Found an authorized account:", account);
//       props.setCurrentAccount(account);
//       console.log(props.currentAccount,"current address");
     

//       let chainId = await ethereum.request({ method: 'eth_chainId' });
//       console.log("Connected to chain " + chainId);
    
//       const goerliChainId = "0x5"; 
//       if (chainId !== goerliChainId) {
//        console.log("You are not connected to the Goerli Test Network!");
//        SwitchtoGOERLI();
//        props.setchainnetwork(true);
//       }else{
//         props.setchainnetwork(true)
//       }
//     } else {
//       console.log("No authorized account found");
//     }
//   }

 

// export const connectWallet = async (props) => {
//     try {
//       const { ethereum } = window;

//       if (!ethereum) {
//         alert("Get MetaMask!");
//         return;
//       }

      
//       const accounts = await ethereum.request({ method: "eth_requestAccounts" });

//       let chainId = await ethereum.request({ method: 'eth_chainId' });
//       console.log("Connected to chain " + chainId);
    
//       const goerliChainId = "0x5"; 
//       if (chainId !== goerliChainId) {
//        console.log("You are not connected to the Goerli Test Network!");
//        SwitchtoGOERLI()
//        props.setchainnetwork(true)
//       }else{
//         props.setchainnetwork(true)
//       }

      
//       console.log("Connected", accounts[0]);
//       props.setCurrentAccount(accounts[0]); 
//     } catch (error) {
//       console.log(error);
//     }
    
//   }