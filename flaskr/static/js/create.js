
const descriptionInput = document.querySelector('#description')
const nameInput = document.querySelector('#name')

let minter = actualAddress
let category = "Art"

var accounts = window.web3.eth.getAccounts().then(function(acc){
  minter = acc[0]
})

let loadedFile
let file

var erc721_instance = new window.web3.eth.Contract(erc721_abi, erc721_address);
var simpleMarketplace_instance = new window.web3.eth.Contract(simpleMarketplace_abi, simpleMarketplace_address);
var token_instance = new window.web3.eth.Contract(token_abi, feeToken_address);
function mintNative(){

  hexNativeFees = window.web3.utils.toHex(mintingFeesNative)
  var accounts = window.web3.eth.getAccounts().then(function(acc){
      parameter = {
          value: hexNativeFees,
          from: acc[0],
          gas: web3.utils.toHex(mintingGas),
          gasPrice: web3.utils.toHex(gasPrice)
      }

      simpleMarketplace_instance.methods.mintNative().send(parameter, (err, transactionHash) => {
          window.alert("Transaction sent: "+transactionHash)
          if(transactionHash){
          $('main').append('<div id="divLoading" style="margin: 0px; padding: 0px; position: fixed; right: 0px; top: 0px; width: 100%; height: 100%; background-color: rgb(102, 102, 102); z-index: 30001; opacity: 0.8;">\
            <p style="position: absolute; color: White; top: 50%; left: 45%;">\
            Pending transactions, please wait...\
            <img src="static/assets/create/loader.gif">\
            </p>\
            </div>');
          }
          tx_hash = transactionHash
      }).on('confirmation', () => {}).then((newContractInstance) => {
        setTimeout(removeLoader, 2000);
          window.alert('NFT minted')
          window.location = "/mynfts"

      })
      .catch(function(error){
        setTimeout(removeLoader, 2000);
        window.alert("Minting failed")
      })
    })

}

function mint(){

  hexTokenFees = window.web3.utils.toHex(mintingFeesToken)


  var accounts = window.web3.eth.getAccounts().then(function(acc){
    let parameter = {
        from: acc[0],
        gas: web3.utils.toHex(mintingGas),
        gasPrice: web3.utils.toHex(gasPrice)
    }

    token_instance.methods.approve(simpleMarketplace_address, hexTokenFees).send(parameter, (err, transactionHash) => {
        window.alert("Transaction sent: "+transactionHash)
        tx_hash = transactionHash
    }).on('confirmation', () => {}).then((newContractInstance) => {
      parameter = {
          from: acc[0],
          gas: web3.utils.toHex(listingGas),
          gasPrice: web3.utils.toHex(gasPrice)
      }
        window.alert('Token approved')
        simpleMarketplace_instance.methods.mint().send(parameter, (err, transactionHash) => {
            window.alert("Transaction sent: "+transactionHash)
            tx_hash = transactionHash
        }).on('confirmation', () => {}).then((newContractInstance) => {
            window.alert('NFT minted')

        })
    })
    })
    .catch(function(error){
      window.alert(error)
    })

}


const acceptFormats = [
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/jpg"
]


const loadFile = (e) => {
    if(e.target.files[0].size > 8388608){
        alert('File is too big for upload!')
        e.value = "";
    }
    else{
        file = e.target.files[0]
        loadedFile = file
        console.log("file: ", file)
        if(acceptFormats.includes(file.type)){
            var image = document.querySelector('.uploaded-img')

            image.src = URL.createObjectURL(e.target.files[0])

            image.classList.add("has-upload")
            document.querySelector('.upload-toggle').classList.add('label-upload-success')
            }
        else{
            alert("Invalid file format!")
        }
    }
}

function create(){
  console.log("creating")


  if(descriptionInput.value && nameInput.value){

    category = $("input[type='radio'][name='category']:checked").val()

    let metadata = {'description':descriptionInput.value,'name':nameInput.value,'artist':minter,'category':category};
    let formData = new FormData()
    formData.append('file', loadedFile)
    formData.append('metadata', JSON.stringify(metadata))

    $('main').append('<div id="divLoading" style="margin: 0px; padding: 0px; position: fixed; right: 0px; top: 0px; width: 100%; height: 100%; background-color: rgb(102, 102, 102); z-index: 30001; opacity: 0.8;">\
      <p style="position: absolute; color: White; top: 50%; left: 45%;">\
      Minting, please wait...\
      <img src="static/assets/create/loader.gif">\
      </p>\
      </div>');

    $.ajax({
      type: "POST",
      url: `/metadata`,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      dataType : 'json',
      success: function(data) {
                  console.log('Success!');
              },
    }).done(response => {

      setTimeout(removeLoader, 2000);
      if (response['status'] == 'success') {
        setTimeout(removeLoader, 2000);
        mintNative()

      } else {
        setTimeout(removeLoader, 2000);
        window.alert("Error minting")
      }
    })
    .fail(err => {
      setTimeout(removeLoader, 2000);
      window.alert("Error minting")
    })
  }

}
