const templates = document.getElementsByTagName('template')

const [itemTemplate, descriptionTemplate, infoTemplate, transactionTemplate] = templates

const activeTab = document.querySelector('.active-item')

const target = document.querySelector('.displayed-tab')

var clon = itemTemplate.content.cloneNode(true)
var clon2 = descriptionTemplate.content.cloneNode(true)

var erc721_instance = new window.web3.eth.Contract(erc721_abi, erc721_address);
var simpleMarketplace_instance = new window.web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);
var auction_instance = new window.web3.eth.Contract(auction_abi, auction_address);

target.append(clon)

const navItems = document.querySelectorAll('.nft-nav-item')
function removeLoader(){
  $('#divLoading').remove();
}


async function load(){
  uri = await erc721_instance.methods.tokenURI(id).call()
  metadata = await $.getJSON(uri);
  document.querySelector('#nft-name').textContent = "Name: "+ metadata["name"];

  document.querySelectorAll('.nft-image').forEach(image => {
      image.src = metadata["image"];
  })

  const likeCount = document.querySelector('.likecount')
  likeCount.textContent = metadata["count"]
  data = {
      id: id,
      contractID: "0x5f6526d19eddc66be3a88cba4ba71b5dbf295922",
      imgUrl: metadata["image"],
      creator: {
          imgUrl: "https://i.imgur.com/rPPklv2.jpg",
          name: "Zabsik"
      },
      likes: metadata["count"]
  }

}

load()

function list(id){
  console.log("id: ", id)
  const fixedPrice = document.querySelector('#fixedPrice')
  if(fixedPrice.value){

    priceWei = (fixedPrice.value * 1000000000000000000).toString()
    hexPrice = window.web3.utils.toHex(priceWei)

    var accounts = window.web3.eth.getAccounts().then(function(acc){
      let parameter = {
          from: acc[0],
          gas: web3.utils.toHex(approveGas),
          gasPrice: web3.utils.toHex(gasPrice)
      }
        erc721_instance.methods.approve(simpleMarketplace_address, id).send(parameter, (err, transactionHash) => {
            window.alert("Transaction sent: "+transactionHash)
            if(transactionHash){
              $('main').append('<div id="divLoading" style="margin: 0px; padding: 0px; position: fixed; right: 0px; top: 0px; width: 100%; height: 100%; background-color: rgb(102, 102, 102); z-index: 30001; opacity: 0.8;">\
                <p style="position: absolute; color: White; top: 50%; left: 45%;">\
                Pending approve transaction, please wait...\
                <img src="../static/assets/create/loader.gif">\
                </p>\
                </div>');
            }
            tx_hash = transactionHash
        }).on('confirmation', () => {}).then((newContractInstance) => {
          setTimeout(removeLoader, 2000);
          parameter = {
              from: acc[0],
              gas: web3.utils.toHex(listingGas),
              gasPrice: web3.utils.toHex(gasPrice)
          }
            setTimeout(removeLoader, 2000);
            window.alert('NFT approved')
            simpleMarketplace_instance.methods.list(id, hexPrice, 0).send(parameter, (err, transactionHash) => {
                window.alert("Transaction sent: "+transactionHash)
                if(transactionHash){
                  $('main').append('<div id="divLoading" style="margin: 0px; padding: 0px; position: fixed; right: 0px; top: 0px; width: 100%; height: 100%; background-color: rgb(102, 102, 102); z-index: 30001; opacity: 0.8;">\
                    <p style="position: absolute; color: White; top: 50%; left: 45%;">\
                    Pending listing transaction, please wait...\
                    <img src="../static/assets/create/loader.gif">\
                    </p>\
                    </div>');
                }
                tx_hash = transactionHash
            }).on('confirmation', () => {}).then((newContractInstance) => {
              setTimeout(removeLoader, 2000);
                window.alert('NFT listed')
                window.location = "/"

            })
            .catch(function(error){
              setTimeout(removeLoader, 2000);
              window.alert(error)
            })
        })
        .catch(function(error){
          setTimeout(removeLoader, 2000);
          window.alert(error)
        })
      })
      .catch(function(error){
        setTimeout(removeLoader, 2000);
        window.alert(error)
      })
  }else{
    window.alert("Required value !")
  }

}

function auction(id){
  const startPrice = document.querySelector('#startPrice')
  startPriceWei = (startPrice.value * 1000000000000000000).toString()
  hexStartPrice = window.web3.utils.toHex(startPriceWei)

  const endPrice = document.querySelector('#endPrice')
  endPriceWei = (endPrice.value * 1000000000000000000).toString()
  hexEndPrice = window.web3.utils.toHex(endPriceWei)

  let duration = document.querySelector('#duration').value
  duration = duration * 3600
  console.log("startPrice: ", hexStartPrice)
  console.log("endPrice: ", hexEndPrice)
  console.log("duration: ", duration)
  console.log("duration: ", duration)
  if(hexStartPrice && hexEndPrice && duration){
    var accounts = window.web3.eth.getAccounts().then(function(acc){
      let parameter = {
          from: acc[0],
          gas: web3.utils.toHex(approveGas),
          gasPrice: web3.utils.toHex(gasPrice)
      }
        erc721_instance.methods.approve(auction_address, id).send(parameter, (err, transactionHash) => {
            window.alert("Transaction sent: "+transactionHash)
            if(transactionHash){
              $('main').append('<div id="divLoading" style="margin: 0px; padding: 0px; position: fixed; right: 0px; top: 0px; width: 100%; height: 100%; background-color: rgb(102, 102, 102); z-index: 30001; opacity: 0.8;">\
                <p style="position: absolute; color: White; top: 50%; left: 45%;">\
                Pending approve transaction, please wait...\
                <img src="../static/assets/create/loader.gif">\
                </p>\
                </div>');
            }
            tx_hash = transactionHash
        }).on('confirmation', () => {}).then((newContractInstance) => {
          parameter = {
              from: acc[0],
              gas: web3.utils.toHex(listingGas),
              gasPrice: web3.utils.toHex(gasPrice)
          }
            setTimeout(removeLoader, 2000);
            window.alert('NFT approved')
            auction_instance.methods.createAuction(id, hexStartPrice, hexEndPrice, duration).send(parameter, (err, transactionHash) => {
                window.alert("Transaction sent: "+transactionHash)
                if(transactionHash){
                  $('main').append('<div id="divLoading" style="margin: 0px; padding: 0px; position: fixed; right: 0px; top: 0px; width: 100%; height: 100%; background-color: rgb(102, 102, 102); z-index: 30001; opacity: 0.8;">\
                    <p style="position: absolute; color: White; top: 50%; left: 45%;">\
                    Pending listing transaction, please wait...\
                    <img src="../static/assets/create/loader.gif">\
                    </p>\
                    </div>');
                }
                tx_hash = transactionHash
            }).on('confirmation', () => {}).then((newContractInstance) => {
                setTimeout(removeLoader, 2000);
                window.alert('NFT auction created')
                window.location = "/"

            })
            .catch(function(error){
              setTimeout(removeLoader, 2000);
              window.alert("Failed")
            })
        })
        .catch(function(error){
          setTimeout(removeLoader, 2000);
          window.alert("Failed")
        })
      })
      .catch(function(error){
        setTimeout(removeLoader, 2000);
        window.alert("Failed")
      })
  }else{

    window.laert("Required values !")
  }
}

document.querySelectorAll('.nft-image').forEach(image => {
    image.src = data.imgUrl;
})

navItems.forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.active-item').classList.toggle('active-item')
        item.classList.toggle('active-item')
        console.log(item.id)
        target.innerHTML = ""
        switch(item.id){
            case "fixed":
                var clon = itemTemplate.content.cloneNode(true);
                target.append(clon)
                return ""
            case "auction":
                var clon = descriptionTemplate.content.cloneNode(true);
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

document.querySelector('.preview-toggle').addEventListener('click', () => {
    document.querySelector('.modal').classList.toggle('toggled-modal')
})

document.querySelector('.modal-quit').addEventListener('click', () => {
    document.querySelector('.modal').classList.toggle('toggled-modal')
})
