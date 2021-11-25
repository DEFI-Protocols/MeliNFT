infura_web3 = new Web3(infura);
window.ethereum.enable();

var erc721_instance = new infura_web3.eth.Contract(erc721_abi, erc721_address);
var simpleMarketplace_instance = new infura_web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);

var auction_instance = new infura_web3.eth.Contract(auction_abi, auction_address);
var token_instance = new infura_web3.eth.Contract(token_abi, feeToken_address);

let address

var accounts = window.web3.eth.getAccounts().then(async function(acc){
  address = acc[0]
})

let artistsData = []
let artistsData_display = []
let hotDeals = []
let hotDeals_display = []
async function loadArtists(){
  let artists = await $.getJSON("./static/uploads/artists/artists.json");

  for (var i = 0; i < artists[0]; i++){

    let artist = await $.getJSON("./static/uploads/artists/metadata/"+artists[i+1]+".json");
    if (parseInt(artist["score"]) > parseInt(artists["min"])){
      score = artist["score"]/1000000000000000000

      artistsData_display.push({
        name: artist["username"],
        amount: score +" ETH",
        profileUrl: artist["image"],
        backgroundUrl: "static/assets/artists/background/JWwevpo.jpg"
      })

      artistsData.push({
        name: artist["username"],
        amount: score +" ETH",
        profileUrl: artist["image"],
        backgroundUrl: "static/assets/artists/background/JWwevpo.jpg"
      })
    }

  }

}

loadArtists()

let nftData = []
let nftData_display = []
let auctionData = []
let auctionData_display = []

var accounts = window.web3.eth.getAccounts().then(async function(acc){

  let totalSupply = await erc721_instance.methods.totalSupply().call()

  let owner
  for(var i = 0; i < totalSupply; i++){
    updatePage()
    artistsData_display = []
    nftData_display = []
    auctionData_display = []
    hotDeals_display = []

    owner = await erc721_instance.methods.ownerOf(i).call()

    notAuction = true
    try{
      auction = await auction_instance.methods.getAuctionByTokenId(i).call()

      notAuction = false
    }catch(err){

    }

    uri = await erc721_instance.methods.tokenURI(i).call()
    metadata = await $.getJSON(uri);

    if (notAuction && owner != simpleMarketplace_address){

    } else if(owner == simpleMarketplace_address ){

      token = await simpleMarketplace_instance.methods.getToken(i).call()

        tokenPrice = (parseInt(token[1]))/1000000000000000000

        nftData_display.push({
            id: i,
            category: metadata["category"],
            imgUrl: metadata["image"],
            name: metadata["name"],
            price: tokenPrice.toPrecision(3),
            likes: metadata["count"],
            "hotDeal": metadata["flag"]
        })
        nftData.push({
            id: i,
            category: metadata["category"],
            imgUrl: metadata["image"],
            name: metadata["name"],
            price: tokenPrice.toPrecision(3),
            likes: metadata["count"],
            "hotDeal": metadata["flag"]
        })

      // }
    }else if (!notAuction){

      bid = await auction_instance.methods.getCurrentPriceByTokenId(i).call()
      bid = (parseInt(bid)+3000000000000)/1000000000000000000

      auctionData_display.push({
          id: i,
          category: "Art",
          imgUrl: metadata["image"],
          name: metadata["name"],
          price: bid.toPrecision(3),
          likes: metadata["count"],
          hotDeal: metadata["flag"]
      })

      auctionData.push({
          id: i,
          category: "Art",
          imgUrl: metadata["image"],
          name: metadata["name"],
          price: bid.toPrecision(3),
          likes: metadata["count"],
          hotDeal: metadata["flag"]
      })

    }

  }

  for(var i = 0; i < nftData.length; i++){

      if(parseInt(nftData[i]["likes"]) > parseInt(minHotDeals)){
        hotDeals.push(nftData[i])
        hotDeals_display.push(nftData[i])
      }

  }

  for(var i = 0; i < auctionData.length; i++){

      if(parseInt(auctionData[i]["likes"]) > parseInt(minHotDeals)){
        hotDeals_display.push(nftData[i])
        hotDeals.push(auctionData[i])
      }

  }

  updatePage()
})

async function buy(object){
  var erc721_instance = new window.web3.eth.Contract(erc721_abi, erc721_address);
  var simpleMarketplace_instance = new window.web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);

  var auction_instance = new window.web3.eth.Contract(auction_abi, auction_address);
  var token_instance = new window.web3.eth.Contract(token_abi, feeToken_address);

  nftId = object
            .parentElement
            .parentElement
            .childNodes[3]
            .childNodes[1]
            .childNodes[5]
            .textContent
  nftPrice = object
            .parentElement
            .parentElement
            .childNodes[3]
            .childNodes[3]
            .childNodes[3]
            .textContent
  nftPrice = nftPrice.split(" ")

  weiPrice = nftPrice[0] * 1000000000000000000

  hexPrice = window.web3.utils.toHex(weiPrice)

  try{
    let metadata = await $.getJSON("static/uploads/artists/metadata/"+address+".json");

    var accounts = window.web3.eth.getAccounts().then(function(acc){
      let parameter = {
          value: hexPrice,
          from: acc[0],
          gas: web3.utils.toHex(buyGas),
          gasPrice: web3.utils.toHex(gasPrice)
      }
        simpleMarketplace_instance.methods.buy(nftId).send(parameter, (err, transactionHash) => {
            window.alert("Transaction sent: "+transactionHash)
            if(transactionHash){
              $('main').append('<div id="divLoading" style="margin: 0px; padding: 0px; position: fixed; right: 0px; top: 0px; width: 100%; height: 100%; background-color: rgb(102, 102, 102); z-index: 30001; opacity: 0.8;">\
                <p style="position: absolute; color: White; top: 50%; left: 45%;">\
                Pending buy transaction, please wait...\
                <img src="static/assets/create/loader.gif">\
                </p>\
                </div>');
            }

            tx_hash = transactionHash
        }).on('confirmation', () => {}).then((newContractInstance) => {
            setTimeout(removeLoader, 2000);
            score = parseInt(metadata['score']) + parseInt(weiPrice)
            let new_metadata = {
                            'username':metadata['username'],
                            'artist':metadata['artist'],
                            'bio':metadata['bio'],
                            'image':metadata['image'],
                            'link':metadata['link'],
                            'social':metadata['social'],
                            'score':score
                          };
            let formData = new FormData()

            formData.append('metadata', JSON.stringify(new_metadata))

            $.ajax({
              type: "POST",
              url: `/update`,
              data: formData,
              cache: false,
              contentType: false,
              processData: false,
              dataType : 'json',
              success: function(data) {
                          console.log('Success!');
                      },
            }).done(response => {
              if (response['status'] == 'success') {

              } else {
                setTimeout(removeLoader, 2000);
                window.alert('Error buying')

              }
            })
            .fail(err => {
              setTimeout(removeLoader, 2000);

            })
            window.alert('Buy success')
        })
      })
      .catch(function(error){
        window.alert(error)
      })

  }catch{
    window.alert("Please complete your profile first")
    window.location = "/profile"

  }
}

async function offer(object){
  var erc721_instance = new window.web3.eth.Contract(erc721_abi, erc721_address);
  var simpleMarketplace_instance = new window.web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);

  var auction_instance = new window.web3.eth.Contract(auction_abi, auction_address);
  var token_instance = new window.web3.eth.Contract(token_abi, feeToken_address);

  nftId = object
            .parentElement
            .parentElement
            .childNodes[3]
            .childNodes[1]
            .childNodes[5]
            .textContent

  nftPrice = object
            .parentElement
            .childNodes[3]
            .value

  weiPrice = nftPrice * 1000000000000000000
  hexPrice = window.web3.utils.toHex(weiPrice)
  let metadata = await $.getJSON("static/uploads/artists/metadata/"+address+".json");
  try{
    let metadata = await $.getJSON("static/uploads/artists/metadata/"+address+".json");

    var accounts = window.web3.eth.getAccounts().then(function(acc){
      let parameter = {
          value: hexPrice,
          from: acc[0],
          gas: web3.utils.toHex(buyGas),
          gasPrice: web3.utils.toHex(gasPrice)
      }
        auction_instance.methods.bid(nftId).send(parameter, (err, transactionHash) => {
            window.alert("Transaction sent: "+transactionHash)
            if(transactionHash){
            $('main').append('<div id="divLoading" style="margin: 0px; padding: 0px; position: fixed; right: 0px; top: 0px; width: 100%; height: 100%; background-color: rgb(102, 102, 102); z-index: 30001; opacity: 0.8;">\
              <p style="position: absolute; color: White; top: 50%; left: 45%;">\
              Pending bid transaction, please wait...\
              <img src="static/assets/create/loader.gif">\
              </p>\
              </div>');
            }
            tx_hash = transactionHash
        }).on('confirmation', () => {}).then((newContractInstance) => {
            console.log("metadata: ", metadata)
            setTimeout(removeLoader, 2000);
            score = parseInt(metadata['score']) + parseInt(weiPrice)
            let new_metadata = {
                            'username':metadata['username'],
                            'artist':metadata['artist'],
                            'bio':metadata['bio'],
                            'image':metadata['image'],
                            'link':metadata['link'],
                            'social':metadata['social'],
                            'score':score
                          };
            let formData = new FormData()

            formData.append('metadata', JSON.stringify(new_metadata))
            $.ajax({
              type: "POST",
              url: `/update`,
              data: formData,
              cache: false,
              contentType: false,
              processData: false,
              dataType : 'json',
              success: function(data) {
                          console.log('Success!');
                      },
            }).done(response => {
              if (response['status'] == 'success') {

                console.log('response.msg : ', response['status'])

              } else {

                console.log('response.msg error: ', obj)

              }
            })
            .fail(err => {
              setTimeout(removeLoader, 2000);

            })
            window.alert('success')
        })
      })
      .catch(function(error){
        setTimeout(removeLoader, 2000);
        window.alert(error)
      })
    }

  catch{
    window.alert("Please complete your profile first")
    window.location = "/profile"

  }
}

async function addLike(object){
  var erc721_instance = new window.web3.eth.Contract(erc721_abi, erc721_address);
  var simpleMarketplace_instance = new window.web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);

  var auction_instance = new window.web3.eth.Contract(auction_abi, auction_address);
  var token_instance = new window.web3.eth.Contract(token_abi, feeToken_address);

  console.log("addLike")
  nftId = object
            .parentElement
            .parentElement
            .childNodes[3]
            .childNodes[1]
            .childNodes[5]
            .textContent
  uri = await erc721_instance.methods.tokenURI(nftId).call()
  metadata = await $.getJSON(uri);
  var new_likes = parseInt(metadata["count"]) + 1
  let new_metadata = {'id':nftId,'description':metadata["description"],'image':metadata["image"],'name':metadata["name"],'artist':metadata["artist"],'category':metadata["category"],'count':new_likes,'flag':metadata["flag"]};
  let formData = new FormData()
  formData.append('metadata', JSON.stringify(new_metadata))

  var accounts = window.web3.eth.getAccounts().then(function(acc){
    let parameter = {
        from: acc[0],
        gas: web3.utils.toHex(approveGas),
        gasPrice: web3.utils.toHex(gasPrice)
    }
  token_instance.methods.approve(simpleMarketplace_address, 1).send(parameter, (err, transactionHash) => {
      window.alert("Transaction sent: "+transactionHash)
      tx_hash = transactionHash
  }).on('confirmation', () => {}).then((newContractInstance) => {
    $.ajax({
      type: "POST",
      url: `/like`,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      dataType : 'json',
      success: function(data) {
                  console.log('Success!');
              },
    }).done(response => {
      if (response['status'] == 'success') {
      } else {

      }
    })
    .fail(err => {
      console.log(err)
      
    })
      window.alert('Liked !')

    })
    .catch(function(error){
      window.alert(error)
    })
  })
}

function updatePage() {


const templates = document.getElementsByTagName('template')

const artistTemplate = templates[0]
const nftTemplate = templates[1]
const auctionsTemplate = templates[2]
const dealsTemplate = templates[3]

const artistTarget = document.getElementsByClassName('artists')[0]
const hotDealTarget = document.getElementsByClassName('deals')[0]
const nftTarget = document.getElementsByClassName('nfts')[0]
const auctionsTarget = document.getElementsByClassName('auctions')[0]

artistsData_display.forEach(data => {
    var clon = artistTemplate.content.cloneNode(true)
    const {backgroundUrl, profileUrl, name, amount} = data

    clon.querySelector('.img').src = backgroundUrl;
    clon.childNodes[1].childNodes[3].src = profileUrl;
    clon.childNodes[1].childNodes[5].textContent = name;
    clon.childNodes[1].childNodes[7].textContent = amount;
    artistTarget.append(clon)
})


const createNFT = (template,target,data) => {
    var clon = template.content.cloneNode(true);
    const {id,category, imgUrl, name, price, likes} = data;

    clon.querySelector('.nft-image').src = imgUrl;
    clon.querySelector('.category').textContent = category;
    clon.querySelector('.nft-name').textContent = name;
    clon.querySelector('.nft-id').textContent = id;
    clon.querySelector('.nft-price').textContent = price + " ETH";
    clon.querySelector('.likecount').textContent = likes;

    target.append(clon)
}


const createDeal = (template,target,data) => {
    var clon = template.content.cloneNode(true);
    const {id,category, imgUrl, name, price, likes} = data;
    let likeDiv = clon.querySelector('.likes')
    let likeCount = clon.querySelector('.likecount')
    let likeImg = clon.querySelector('.like')

    clon.querySelector('.nft-image').src = imgUrl;
    clon.querySelector('.category').textContent = category;
    clon.querySelector('.nft-name').textContent = name;

    clon.querySelector('.nft-price').textContent = price + " ETH";

    target.append(clon)
}

nftData_display.forEach(data => {

    createNFT(nftTemplate,nftTarget,data)
})

auctionData_display.forEach(data => {
    createNFT(auctionsTemplate,auctionsTarget,data)
})

hotDeals.forEach(data => {

    createDeal(dealsTemplate,hotDealTarget,data)
})

const selectors = document.querySelectorAll('.selector')

var filters = []

selectors.forEach(selector => {
    selector.addEventListener('click', () => {
        selector.classList.toggle('active-selector')
        const selectorText = selector.querySelector('p').innerHTML

        if(filters.includes(selectorText)){
            filters = filters.filter(item => item != selectorText)
        }
        else{
            filters.push(selectorText)
        }

        nftTarget.innerHTML = "";
        var filteredData = [];
        if(filters.length > 0){


            filteredData = nftData.filter(data => filters.includes(data.category))

            filteredData.forEach(data => {
                createNFT(nftTemplate, nftTarget, data)
            })
        }
        else{
            filteredData = nftData
            filteredData.forEach(data => {
                createNFT(nftTemplate, nftTarget, data)
            })
        }

    })
})

const activeDropdownSelector = document.querySelector('.active-dropdown-selector')

const dropdownSelectors = document.querySelectorAll('.dropdown-selector')
dropdownSelectors.forEach(selector => {
    selector.addEventListener('click', () => {
        var activeText = activeDropdownSelector.textContent
        var selectorText = selector.textContent
        selector.textContent = activeText;
        activeDropdownSelector.textContent = selectorText
        switch(selectorText){
            case "Likes":
                var data = [...nftData];
                data.sort((a,b) => (
                    a.likes < b.likes ? 1 : -1
                ))
                nftTarget.innerHTML = ""
                data.forEach(item => {
                    createNFT(nftTemplate, nftTarget, item)
                })

                return ""
            case "Price":
                var data = [...nftData];
                data.sort((a,b) => (
                    a.price < b.price ? 1 : -1
                ))
                nftTarget.innerHTML = ""
                data.forEach(item => {
                    createNFT(nftTemplate, nftTarget, item)
                })
        }
    })
  })
}

searchBar.addEventListener("input", () => {
    const filteredData = nftData.filter(data => data.name.toLowerCase().includes(searchBar.value))
    const nftTarget = document.getElementsByClassName('nfts')[0]
    const createNFT = (template,target,data) => {
        var clon = template.content.cloneNode(true);
        const {id,category, imgUrl, name, price, likes} = data;

        clon.querySelector('.nft-image').src = imgUrl;
        clon.querySelector('.category').textContent = category;
        clon.querySelector('.nft-name').textContent = name;
        clon.querySelector('.nft-id').textContent = id;
        clon.querySelector('.nft-price').textContent = price + " ETH";
        clon.querySelector('.likecount').textContent = likes;

        target.append(clon)
    }

    const templates = document.getElementsByTagName('template')

    const nftTemplate = templates[1]

    nftTarget.innerHTML = ""
    filteredData.forEach(data =>{
        createNFT(nftTemplate,nftTarget,data)
    })
})
