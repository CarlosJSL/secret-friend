import React, { useEffect } from "react";
import { abiSchema } from '../services';
const Web3 = require('web3');

function Home() {

  useEffect(() => {
    loadMetaMask();
  }, []);

  function loadMetaMask() {
    let web3Provider = null;

    if (window.ethereum) {
      web3Provider = window.ethereum;
      try {
        window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access")
      }
    }
    else if (window.web3) {
      web3Provider = window.web3.currentProvider;
    }

    else {
      console.log('No web3? You should consider trying MetaMask!')
      web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    let web3 = new Web3(web3Provider);
    let contract = new web3.eth.Contract(abiSchema, '0x5C608BB56d94371d7eE5BAFf5ECe967D68613AEe');
    doTransaction(contract);
  }

  async function doTransaction(contract) {
    // const transaction = await contract.methods.getBalance().send({
    //   from: '0x8d46Fa0ecAf7DE3E3d7E09dcc0153040F061FBDB',
    //   value: 1,
    // })
    // console.log(transaction)
    // const response = await contract.methods.getBalance().call({ from: '0x8d46Fa0ecAf7DE3E3d7E09dcc0153040F061FBDB' })
  }

  return (
    <p>hello world</p>
  );
}

export default Home;
