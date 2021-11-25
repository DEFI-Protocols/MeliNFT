let actualAddress

const DApp = {
  web3: null,
  contracts: {},
  accounts: [],

  init: function() {
    console.log("connect 2")
    return DApp.initWeb3();
  },

  initWeb3: async function () {
    if (typeof window.ethereum !== 'undefined') {
      // New web3 provider
      // As per EIP1102 and EIP1193
      // Ref: https://eips.ethereum.org/EIPS/eip-1102
      // Ref: https://eips.ethereum.org/EIPS/eip-1193
      console.log("connect 3")
      try {
        // Request account access if needed
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        // console.log("accounts: ", window.web3.utils.toChecksumAddress(accounts[0]))
        console.log("connect 4")

        actualAddress = window.web3.utils.toChecksumAddress(accounts[0])
        console.log("actualAddress 0: ", actualAddress)
        // Accounts now exposed, use them
        DApp.updateAccounts(accounts);

        // Opt out of refresh page on network change
        // Ref: https://docs.metamask.io/guide/ethereum-provider.html#properties
        ethereum.autoRefreshOnNetworkChange = false;

        // When user changes to another account,
        // trigger necessary updates within DApp
        window.ethereum.on('accountsChanged', DApp.updateAccounts);
      } catch (error) {
        // User denied account access
        console.error('User denied web3 access');
        return;
      }
      DApp.web3 = new Web3(window.ethereum);
    }
    else if (window.web3) {
      // Deprecated web3 provider
      DApp.web3 = new Web3(web3.currentProvider);
      // no need to ask for permission
    }
    // No web3 provider
    else {
      console.error('No web3 provider detected');
      return;
    }
    return DApp.initContract();
  },

  updateAccounts: async function(accounts) {
    const firstUpdate = !(DApp.accounts && DApp.accounts[0]);
    DApp.accounts = accounts || await DApp.web3.eth.getAccounts();
    // console.log('updateAccounts', window.web3.utils.toChecksumAddress(accounts[0]));
    actualAddress = window.web3.utils.toChecksumAddress(accounts[0])
    connect2()
    if (!firstUpdate) {
      DApp.render();
    }
  },

  initContract: async function() {
    let networkId = await DApp.web3.eth.net.getId();
    // console.log('networkId', networkId);


    return DApp.render();
  },

  render: async function() {
    // show spinner before loading data from smart contract
    // TODO

    // set or refresh any event listeners

    // update DOM to render account address where relevant
    // TODO using DApp.accounts[0]

    // retrieve data from smart contract and render it
    // TODO using DApp.contracts.MySmartContract

    // Hide spinner after loading and rendering data from smart contract
  },
};

// console.log("DApp: ", DApp)

DApp.init();

async function connect(){
  const ethEnabled = () => {
    if (window.web3)
    {
      try{
        window.web3 = new Web3(window.web3.currentProvider);
        window.ethereum.enable();
        return true;
      }catch(err){
        alert("Metamask not connected")
      }

    }
    return false;
  }

  if (!ethEnabled()) {
    alert("Please install MetaMask to use this dApp!");
  } else{

    // var accounts = window.web3.eth.getCoinbase().then(async function(acc){
    // console.log("window.web3.eth.coinbase: ", acc)
    try{
      console.log("actualAddress: ", actualAddress)
      artist = await $.getJSON("./static/uploads/artists/metadata/"+actualAddress+".json");

      document.querySelector('.connect').textContent = artist["username"]
    }catch(err){
      document.querySelector('.connect').textContent = actualAddress.substring(0, 6) + " ... " + actualAddress.substr(actualAddress.length - 4)
    }

    alert("connected to metamask")

    // })
  }

  // web3 = new Web3(web3.currentProvider);
  // console.log("web3: ", window.web3.currentProvider)
  // window.ethereum.enable();
}

async function connect2(){
  const ethEnabled = () => {
    if (window.web3)
    {
      try{
        window.web3 = new Web3(window.web3.currentProvider);
        window.ethereum.enable();
        window.ethereum.on('accountsChanged', DApp.updateAccounts);
        return true;
      }catch(err){
        alert("Metamask not connected")
      }

    }
    return false;
  }

  if (!ethEnabled()) {
    alert("Please install MetaMask to use this dApp!");
  } else{

    // var accounts = window.web3.eth.getCoinbase().then(async function(acc){
    // console.log("window.web3.eth.coinbase: ", acc)
    try{
      console.log("actualAddress: ", actualAddress)
      artist = await $.getJSON("./static/uploads/artists/metadata/"+actualAddress+".json");

      document.querySelector('.connect').textContent = artist["username"]
    }catch(err){
      document.querySelector('.connect').textContent = actualAddress.substring(0, 6) + " ... " + actualAddress.substr(actualAddress.length - 4)
    }

    // alert("connected to metamask")

    // })
  }

  // web3 = new Web3(web3.currentProvider);
  // console.log("web3: ", window.web3.currentProvider)
  // window.ethereum.enable();
}

connect2()
