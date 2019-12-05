import React, { useEffect, useState } from "react";
import { abiSchema } from '../services';
import spinner from '../assets/loading.svg';
import './Home.css';

const Web3 = require('web3');

function Home() {
  const [state, setState] = useState({
    disableButton: false,
    fieldsNumber: [],
    loading: false,
  });

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

  function newDraw() {
    setState({ ...state, disableButton: true });
  }

  function createFields(e) {
    setState({
      disableButton: state.disableButton,
      fieldsNumber: e.target.value ? Array(parseInt(e.target.value)).fill().map(() => Math.round(Math.random() * parseInt(e.target.value))) : []
    })
  }

  function populateWallets(e) {
    const walletAddress = e.target.value;

    setState({
      ...state,
      [e.target.name]: walletAddress,
    });
  }

  function createDraw() {
    let wallets = [];

    Object.entries(state).forEach((entry) => {
      if (entry[0].includes("participant")) {
        wallets.push(entry[1])
      }
    })
    // setState({
    //   ...state,
    //   loading: true,
    // })
  }

  return (
    <div className="container">
      <button className="button" onClick={newDraw} style={{ display: state.disableButton ? 'none' : 'flex' }}>
        <p className="button__text">Novo sorteio</p>
      </button>
      <button className="button" style={{ display: state.disableButton ? 'none' : 'flex' }}>
        <p className="button__text">Verificar meus sorteios</p>
      </button>
      <div className="new-draw" style={{ display: state.disableButton ? 'flex' : 'none' }}>
        <label className="form-input__text">Quantidade de participantes</label>
        <input maxLength="1" onChange={(e) => createFields(e)} className="form-input" type="text" />
        {
          state.fieldsNumber.map((e, index) => (
            <div className="form-box" key={index}>
              <label className="form-input__text"> Número da carteira do participante {index + 1}</label>
              <input onChange={populateWallets} name={`participant${index}`} className="form-input__participants" type="text" />
            </div>
          ))
        }

        <button className="button__create-draw" onClick={createDraw} style={{ pointerEvents: state.fieldsNumber.length <= 0 ? 'none' : 'initial' }}>
          {
            state.loading ? <img src={spinner} alt="" style={{ width: '30px' }} /> : 'Criar sorteio'
          }
        </button>
      </div>
    </div>
  );
}

export default Home;
