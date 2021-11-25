function removeLoader(){
  console.log("removing loader")

      $('#divLoading').remove();

}


async function getCoinbase(){
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  console.log("connect 4")

  return window.web3.utils.toChecksumAddress(accounts[0])
}


async function item(object){

  nftId = object
            .parentElement
            .parentElement
            .childNodes[1]
            .childNodes[5]
            .textContent
  window.location = "/nft/"+nftId
}
