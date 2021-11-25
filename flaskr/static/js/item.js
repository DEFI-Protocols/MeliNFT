const templates = document.getElementsByTagName('template')

const [itemTemplate, descriptionTemplate, infoTemplate, transactionTemplate] = templates

const activeTab = document.querySelector('.active-item')

const target = document.querySelector('.displayed-tab')

const priceTag = document.querySelector('.price')

var erc721_instance = new window.web3.eth.Contract(erc721_abi, erc721_address);
var simpleMarketplace_instance = new window.web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);
var auction_instance = new window.web3.eth.Contract(auction_abi, auction_address);

let description
let name
let price
let artist
let artistUsername
let artistImage

async function load(){
  uri = await erc721_instance.methods.tokenURI(id).call()
  metadata = await $.getJSON(uri);

  description = metadata["description"]
  name = metadata["name"]
  artist = metadata["artist"]
  try{
    let artist_data = await $.getJSON("../static/uploads/artists/metadata/"+artist+".json")
    document.querySelector('.creator-img').src = artist_data["image"]
    document.querySelector('.creator-name').innerHTML = artist_data["username"]
  }
  catch(err){
    document.querySelector('.creator-img').src = "../static/assets/artists/profile/unknown.jpg"
    document.querySelector('.creator-name').innerHTML = "Unknown"
  }

  let token = await simpleMarketplace_instance.methods.getToken(id).call()
  priceWei = token[1]
  price = (parseInt(token[1]))/1000000000000000000
  document.querySelector('.description-text').textContent = "Description: "+ metadata["description"];

  document.querySelector('.id-nft').innerHTML = id
  document.querySelector('.likecount').innerHTML = metadata["count"]

  if(token[2] == zero_address){
    bid = await auction_instance.methods.getCurrentPriceByTokenId(id).call()
    bidWei = parseInt(bid)+3000000000000
    price = (parseInt(bid)+3000000000000)/1000000000000000000
    document.querySelector('.price').textContent = "Current bid: "+ price.toFixed(5) + " ETH"

    document.querySelector('#buy-section').innerHTML = '<button class="buy" onclick="offer(bidWei)">Bid</button>';

  }else{
    document.querySelector('.price').textContent = "Price: "+ price.toFixed(5)  + " ETH"
    document.querySelector('#buy-section').innerHTML = '<button class="buy" onclick="buy(priceWei)">Buy</button>';

  }

  document.querySelector('.nft-name').textContent = "NFT Name: "+name;
  //
  document.querySelectorAll('.nft-image').forEach(image => {
      image.src = metadata["image"]; //data.imgUrl;
  })



}

load()


async function buy(price){

  var erc721_instance = new window.web3.eth.Contract(erc721_abi, erc721_address);
  var simpleMarketplace_instance = new window.web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);

  var auction_instance = new window.web3.eth.Contract(auction_abi, auction_address);

  nftId = id
  nftPrice = price
  nftPrice = nftPrice.split(" ")

  weiPrice = nftPrice[0] * 1000000000000000000
  weiPrice = price

  hexPrice = window.web3.utils.toHex(weiPrice)

  var accounts = window.web3.eth.getAccounts().then(async function(acc){
    let metadata = await $.getJSON("../static/uploads/artists/metadata/"+acc[0]+".json");

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
              <img src="../static/assets/create/loader.gif">\
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
              window.alert("Buy success !")
              window.location = "/mynfts"

            } else {
              window.alert('Error buying')

            }
          })
          .fail(err => {
            setTimeout(removeLoader, 2000);
            window.alert('Failed')

          })
          setTimeout(removeLoader, 2000);
          window.alert('Buy success')
      })
    })
    .catch(function(error){
      setTimeout(removeLoader, 2000);
      window.alert(error)
    })
}

async function offer(bid){

  var erc721_instance = new window.web3.eth.Contract(erc721_abi, erc721_address);
  var simpleMarketplace_instance = new window.web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);

  var auction_instance = new window.web3.eth.Contract(auction_abi, auction_address);

  nftId = id

  nftPrice = bid

  weiPrice = nftPrice * 1000000000000000000

  hexPrice = window.web3.utils.toHex(weiPrice)

  var accounts = window.web3.eth.getAccounts().then(async function(acc){
    let metadata = await $.getJSON("../static/uploads/artists/metadata/"+acc[0]+".json");

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
            <img src="../static/assets/create/loader.gif">\
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
              window.alert("Buy success !")
              window.location = "/mynfts"
              console.log('response.msg : ', response['status'])

            } else {
              window.alert('Failed')
              console.log('response.msg error: ', obj)

            }
          })
          .fail(err => {
            // console.log(err)
            setTimeout(removeLoader, 2000);
            window.alert('Failed')
          })
          setTimeout(removeLoader, 2000);
          window.alert('success')
      })
    })
    .catch(function(error){
      setTimeout(removeLoader, 2000);
      window.alert(error)
    })
}



const navItems = document.querySelectorAll('.nft-nav-item')

document.querySelectorAll('.nft-image').forEach(image => {
    image.src = data.imgUrl;
})

navItems.forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.active-item').classList.toggle('active-item')
        item.classList.toggle('active-item')
        console.log(item.innerHTML)
        target.innerHTML = ""

        switch(item.innerHTML){
            case "Item":
                var clon = itemTemplate.content.cloneNode(true);
                clon.querySelector('.price').innerHTML = "0.35 ETH"
                target.append(clon)
                return ""
            case "Description":
                var clon = descriptionTemplate.content.cloneNode(true)
                var placeholderText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio tempor orci dapibus ultrices in iaculis. Id porta nibh venenatis cras sed. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Sodales ut etiam sit amet nisl purus. Fermentum dui faucibus in ornare quam."
                clon.querySelector('.description-text').innerHTML = placeholderText
                target.append(clon)
                return ""
            case "Info":
                var clon = infoTemplate.content.cloneNode(true)
                clon.querySelector('.id-nft').innerHTML = data.id;
                clon.querySelector('.id-contract').innerHTML = data.contractID;
                clon.querySelector('.creator-img').src = data.creator.imgUrl;
                clon.querySelector('.creator-name').innerHTML = data.creator.name
                target.append(clon)
                return ""
        }
    })
})

const likeDiv = document.querySelector('.likes')
const likeImg = document.querySelector('.like')
const likeCount = document.querySelector('.likecount')

likeCount.innerHTML = data.likes

likeImg.addEventListener('click', () => {
    if(likeDiv.classList.contains("liked")){
        likeImg.src = "./assets/unliked.png"
        likeCount.textContent = data.likes
        localStorage.setItem(data.id, false)
    }
    else{
        likeImg.src = "./assets/like.png"
        likeCount.textContent = data.likes + 1
        localStorage.setItem(data.id, true)
    }
    likeDiv.classList.toggle('liked')

})

const transactionTarget = document.querySelector(".transactions")

document.querySelector('.preview-toggle').addEventListener('click', () => {
    document.querySelector('.modal').classList.toggle('toggled-modal')
})

document.querySelector('.modal-quit').addEventListener('click', () => {
    document.querySelector('.modal').classList.toggle('toggled-modal')
})
