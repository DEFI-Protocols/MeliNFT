infura_web3 = new Web3(infura);
window.ethereum.enable();

var erc721_instance = new infura_web3.eth.Contract(erc721_abi, erc721_address);
var simpleMarketplace_instance = new infura_web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);

var auction_instance = new infura_web3.eth.Contract(auction_abi, auction_address);

let nftData = []
let hotDeals = []
let auctionsData = []

let nftData_display = []
let hotDeals_display = []
let auctionsData_display = []
let loaded = false

var accounts = window.web3.eth.getAccounts().then(async function(acc){
  let totalSupply = await erc721_instance.methods.totalSupply().call()

  let owner
  for(var i = 0; i < totalSupply; i++){
    updatePage()
    nftData_display = []
    hotDeals_display = []
    auctionsData_display = []
    owner = await erc721_instance.methods.ownerOf(i).call()

    notAuction = true
    try{
      auction = await auction_instance.methods.getAuctionByTokenId(i).call()
      notAuction = false
    }catch(err){

    }

    uri = await erc721_instance.methods.tokenURI(i).call()
    metadata = await $.getJSON(uri);
    if (owner == acc[0] && notAuction){
      nftData.push({
          id: i,
          category: "Art",
          imgUrl: metadata["image"],
          name: metadata["name"],
          price: 0.60,
          likes: metadata["count"],
          "hotDeal": metadata["flag"]
      })

      nftData_display.push({
          id: i,
          category: "Art",
          imgUrl: metadata["image"],
          name: metadata["name"],
          price: 0.60,
          likes: metadata["count"],
          "hotDeal": metadata["flag"]
      })

    } else if(owner == simpleMarketplace_address ){
      token = await simpleMarketplace_instance.methods.getToken(i).call()
      tokenPrice = token[1]/1000000000000000000
      if (token[2] == acc[0])
      {

        hotDeals.push({
            id: i,
            category: "Art",
            imgUrl: metadata["image"],
            name: metadata["name"],
            price: tokenPrice.toPrecision(3),
            likes: metadata["count"],
            "hotDeal": metadata["flag"]
        })

        hotDeals_display.push({
            id: i,
            category: "Art",
            imgUrl: metadata["image"],
            name: metadata["name"],
            price: tokenPrice.toPrecision(3),
            likes: metadata["count"],
            "hotDeal": metadata["flag"]
        })
      }
    }else if (owner == acc[0] && !notAuction){

      bid = await auction_instance.methods.getCurrentPriceByTokenId(i).call()
      bid = bid/1000000000000000000
      auctionsData.push({
          id: i,
          category: "Art",
          imgUrl: metadata["image"],
          name: metadata["name"],
          price: bid.toPrecision(3),
          likes: metadata["count"],
          "hotDeal": metadata["flag"]
      })

      auctionsData_display.push({
          id: i,
          category: "Art",
          imgUrl: metadata["image"],
          name: metadata["name"],
          price: bid.toPrecision(3),
          likes: metadata["count"],
          "hotDeal": metadata["flag"]
      })
    }

  }
  updatePage()
})

function list(object){
  var erc721_instance = new window.web3.eth.Contract(erc721_abi, erc721_address);
  var simpleMarketplace_instance = new window.web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);
  var auction_instance = new window.web3.eth.Contract(auction_abi, auction_address);

  nftId = object
            .parentElement
            .parentElement
            .parentElement
            .childNodes[3]
            .childNodes[3]
            .textContent
  let metadata = {'id': nftId};

  window.location = "/listing/"+nftId
}

function unlistAuction(object){
  var erc721_instance = new window.web3.eth.Contract(erc721_abi, erc721_address);
  var simpleMarketplace_instance = new window.web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);
  var auction_instance = new window.web3.eth.Contract(auction_abi, auction_address);

  nftId = object
            .parentElement
            .parentElement
            .parentElement
            .childNodes[2]
            .childNodes[3]
            .childNodes[1]
            .childNodes[5]
            .textContent

  var accounts = window.web3.eth.getAccounts().then(function(acc){
    let parameter = {
        from: acc[0],
        gas: web3.utils.toHex(unlistingGas),
        gasPrice: web3.utils.toHex(gasPrice)
    }
      auction_instance.methods.cancelAuctionByTokenId(nftId).send(parameter, (err, transactionHash) => {
          window.alert("Transaction sent: "+transactionHash)
          tx_hash = transactionHash
          if(transactionHash){
            $('main').append('<div id="divLoading" style="margin: 0px; padding: 0px; position: fixed; right: 0px; top: 0px; width: 100%; height: 100%; background-color: rgb(102, 102, 102); z-index: 30001; opacity: 0.8;">\
              <p style="position: absolute; color: White; top: 50%; left: 45%;">\
              Pending delisting transaction, please wait...\
              <img src="../static/assets/create/loader.gif">\
              </p>\
              </div>');
          }
      }).on('confirmation', () => {}).then((newContractInstance) => {
          window.alert('NFT delisted')
          setTimeout(removeLoader, 2000);

      })
      .catch(function(error){
        setTimeout(removeLoader, 2000);
        window.alert("Failed ")
      })
  })
}

function unlist(object){
  var erc721_instance = new window.web3.eth.Contract(erc721_abi, erc721_address);
  var simpleMarketplace_instance = new window.web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);
  var auction_instance = new window.web3.eth.Contract(auction_abi, auction_address);

  nftId = object
            .parentElement
            .parentElement
            .parentElement
            .childNodes[2]
            .childNodes[3]
            .childNodes[1]
            .childNodes[5]
            .textContent

  var accounts = window.web3.eth.getAccounts().then(function(acc){
    let parameter = {
        from: acc[0],
        gas: web3.utils.toHex(unlistingGas),
        gasPrice: web3.utils.toHex(gasPrice)
    }
      simpleMarketplace_instance.methods.unlist(nftId).send(parameter, (err, transactionHash) => {
          window.alert("Transaction sent: "+transactionHash)
          tx_hash = transactionHash
          if(transactionHash){
            $('main').append('<div id="divLoading" style="margin: 0px; padding: 0px; position: fixed; right: 0px; top: 0px; width: 100%; height: 100%; background-color: rgb(102, 102, 102); z-index: 30001; opacity: 0.8;">\
              <p style="position: absolute; color: White; top: 50%; left: 45%;">\
              Pending delisting transaction, please wait...\
              <img src="../static/assets/create/loader.gif">\
              </p>\
              </div>');
          }
      }).on('confirmation', () => {}).then((newContractInstance) => {
          window.alert('NFT delisted')
          setTimeout(removeLoader, 2000);

      })

      .catch(function(error){
        setTimeout(removeLoader, 2000);
        window.alert("Failed")
      })
  })
}

function updatePage(){

  const templates = document.getElementsByTagName('template')

  const listedNftTemplate = templates[0]
  const auctionsNftTemplate = templates[1]
  const nftTemplate = templates[2]

  const hotDealTarget = document.getElementsByClassName('deals')[0]
  const auctionsTarget = document.getElementsByClassName('auctions')[0]
  const nftTarget = document.getElementsByClassName('nfts')[0]

  const createNFT = (template,target,data) => {
      var clon = template.content.cloneNode(true);
      const {id,category, imgUrl, name, price, likes} = data;
      let likeDiv = clon.querySelector('.likes')
      let likeCount = clon.querySelector('.likecount')
      let likeImg = clon.querySelector('.like')

      clon.querySelector('.nft-image').src = imgUrl;
      clon.querySelector('.category').textContent = "Category: "+ category;;
      clon.querySelector('.nft-name').textContent =  name;
      clon.querySelector('.nft-id').textContent =  id;
      clon.querySelector('.nft-price').textContent = price + " ETH";
      clon.querySelector('.likecount').textContent = likes;

      if(localStorage.getItem(id) == "true" ){
          likeImg.src = "static/assets/like.png"
          likeCount.textContent = likes + 1
          likeDiv.classList.toggle('liked')
      }else{
          likeImg.src = "static/assets/index/unliked.png"
          likeCount.textContent = likes
      }


      clon.querySelector('.like').addEventListener('click', () => {

          if(likeDiv.classList.contains("liked")){
              likeImg.src = "static/assets/index/unliked.png"
              likeCount.textContent = likes
              localStorage.setItem(id, false)
          }
          else{
              likeImg.src = "static/assets/index/like.png"
              likeCount.textContent = likes + 1
              localStorage.setItem(id, true)
          }
          likeDiv.classList.toggle('liked')

      })
      target.append(clon)
  }

  const createNFT2 = (template,target,data) => {
      var clon = template.content.cloneNode(true);
      const {id,category, imgUrl, name, price, nftId, likes} = data;
      let likeDiv = clon.querySelector('.likes')
      let likeCount = clon.querySelector('.likecount')
      let likeImg = clon.querySelector('.like')

      clon.querySelector('.nft-image').src = imgUrl;
      clon.querySelector('.category').textContent = "Category: "+ category;
      clon.querySelector('.nft-name').textContent = "Name: "+name;
      clon.querySelector('.nft-id').textContent = id;
      clon.querySelector('.likecount').textContent = likes;

      if(localStorage.getItem(id) == "true" ){
          likeImg.src = "static/assets/like.png"
          likeCount.textContent = likes + 1
          likeDiv.classList.toggle('liked')
      }else{
          likeImg.src = "static/assets/index/unliked.png"
          likeCount.textContent = likes
      }

      clon.querySelector('.like').addEventListener('click', () => {

          if(likeDiv.classList.contains("liked")){
              likeImg.src = "static/assets/index/unliked.png"
              likeCount.textContent = likes
              localStorage.setItem(id, false)
          }
          else{
              likeImg.src = "static/assets/index/like.png"
              likeCount.textContent = likes + 1
              localStorage.setItem(id, true)
          }
          likeDiv.classList.toggle('liked')
          console.log(localStorage)
      })
      target.append(clon)
  }

  hotDeals_display.forEach(data => {
      createNFT(listedNftTemplate,hotDealTarget,data)
  })

  auctionsData_display.forEach(data => {
      createNFT(auctionsNftTemplate,auctionsTarget,data)
  })

  nftData_display.forEach(data => {
      createNFT2(nftTemplate,nftTarget,data)
  })

  const searchBar = document.querySelector('#searchbar')

}
