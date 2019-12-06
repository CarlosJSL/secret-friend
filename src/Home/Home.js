import React, { useEffect, useState } from "react";
import { abiSchema } from '../services';
import spinner from '../assets/loading.svg';
import './Home.css';

const Web3 = require('web3');
const contractHash = '0x00a00a5cadc7ed1f40b778ea7129269eea4f60e1';
const myWalletHash = '0x8d46Fa0ecAf7DE3E3d7E09dcc0153040F061FBDB';

function Home() {
  let initialState = {
    fieldsNumber: [],
    loading: false,
    contract: {},
    showModal: false,
  };
  const [state, setState] = useState(initialState);

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
    let contract = new web3.eth.Contract(abiSchema, contractHash);
    contract.events.allEvents({ fromBlock: 'latest' }, function (error, result) {

      console.log('sorteio realizado')
      console.log(result)
      setState({
        ...state,
        announce: result,
      })
    });

    setState({
      ...state,
      contract
    })
  }

  function openModal() {
    setState({
      ...state,
      showModal: true,
    })
  }


  function newDraw() {
    setState({ ...state, disableButton: true });
  }

  function createFields(e) {
    setState({
      ...state,
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

  async function createDraw() {
    let wallets = [];

    Object.entries(state).forEach((entry) => {
      if (entry[0].includes("participant")) {
        wallets.push(entry[1])
      }
    })
    setState({
      ...state,
      loading: true,
    })

    try {

      await state.contract.methods.join(wallets).send({
        from: myWalletHash,
      })
      setState(initialState)
    } catch (error) {
      setState({
        ...state,
        loading: false,
      })
      console.log(error)
    }

  }

  async function announce() {
    const announce = await state.contract.methods.annnounce().call({
      from: myWalletHash,
    });
  }

  async function cheat() {
    setState({
      ...state,
      loading: true,
    })

    try {
      await state.contract.methods.Cheating(
        state.cheatFrom,
        state.cheatTo,
        state.cheatValue
      ).call({
        from: myWalletHash,
      });

      setState(initialState)
    } catch (error) {
      console.log(error)
      setState(initialState)
    }
  }


  async function inputHandler(e, inputName) {
    setState({
      ...state,
      [inputName]: e.target.value,
    })
  }

  return (
    <div className="container">
      <button className="button" onClick={newDraw} style={{ display: state.disableButton ? 'none' : 'flex' }}>
        <p className="button__text">Novo sorteio</p>
      </button>
      <button className="button" onClick={announce} style={{ display: state.disableButton ? 'none' : 'flex' }}>
        <p className="button__text">Sortear</p>
      </button>
      <button className="button" onClick={openModal} style={{ display: state.disableButton ? 'none' : 'flex' }}>
        <p className="button__text">Roubar</p>
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
        <button className="button__create-draw" onClick={() => setState(initialState)} >
          Voltar
        </button>
      </div>
      <div className="modalWrapper" style={{ display: state.showModal ? 'flex' : 'none' }}>
        <div className="modal">
          <p className="close-icon" onClick={() => setState(initialState)}>X</p>
          <div className="form-box" style={{ alignSelf: 'center' }}>
            <label className="form-input__text"> Número da carteira de origem</label>
            <input name="cheatFrom" onChange={(e) => inputHandler(e, 'cheatFrom')} className="form-input__participants" type="text" />
          </div>
          <div className="form-box" style={{ alignSelf: 'center' }}>
            <label className="form-input__text"> Número da carteira de destino</label>
            <input name="cheatTo" onChange={(e) => inputHandler(e, 'cheatTo')} className="form-input__participants" type="text" />
          </div>
          <div className="form-box" style={{ alignSelf: 'center' }}>
            <label className="form-input__text"> Valor</label>
            <input name="cheatValue" onChange={(e) => inputHandler(e, 'cheatValue')} className="form-input__participants" type="number " />
          </div>
          <button style={{ alignSelf: 'center', background: 'black', width: '50%' }} className="button__create-draw" onClick={cheat} >
            {
              state.loading ? <img src={spinner} alt="" style={{ width: '30px' }} /> : 'Roubar'
            }
          </button>
        </div>
      </div>
      <div className="result-box">

      </div>
    </div>
  );
}

export default Home;
