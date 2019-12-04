import React, { useEffect } from "react";
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
  }

  return (
    <p>hello world</p>
  );
}

export default Home;
