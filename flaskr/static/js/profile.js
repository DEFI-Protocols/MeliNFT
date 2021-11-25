const socialInput = document.querySelector('.social-input')
let address

let imagePath

let loadedFile
let file

function loadImage(path) {
    var img = new Image();
    img.onload = function () {

    };
    img.src = path
}


async function loadProfile(){

    var accounts = window.web3.eth.getAccounts().then(async function(acc){

    actualAddress = await getCoinbase()

    try{
      let artist_data = await $.getJSON("../static/uploads/artists/metadata/"+actualAddress+".json")

      document.querySelector('#name').value = artist_data["username"];
      document.querySelector('#social').value = artist_data["social"];
      document.querySelector('#description').value = artist_data["bio"];

      var image = document.querySelector('.uploaded-img')

      image.src = artist_data["image"]

      imagePath = artist_data["image"]

      image.classList.add("has-upload")
      document.querySelector('.upload-toggle').classList.add('label-upload-success')

    }catch(e){

    }


  })
}

loadProfile()

const acceptSocial = [
    "https://facebook.com/",
    "https://twitter.com/",
    "https://instagram.com/",
    "https://www.facebook.com/",
    "https://www.twitter.com/",
    "https://www.instagram.com/",
    "www.facebook.com/",
    "www.twitter.com/",
    "www.instagram.com/"
]


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

        var file = e.target.files[0]
        console.log("file: ", file)
        loadedFile = file
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

function edit(){
  const name = document.querySelector('#name')
  const social = document.querySelector('#social')
  const description = document.querySelector('#description')
  address = actualAddress
  if(name.value){
    let metadata = {
                    'username':name.value,
                    'artist':address,
                    'bio':description.value,
                    'link':social.value,
                    'social':social.value,
                    'imagePath': imagePath
                  };
    let formData = new FormData()
    formData.append('file', loadedFile)
    formData.append('metadata', JSON.stringify(metadata))
    $.ajax({
      type: "POST",
      url: `/edit`,
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

        alert("Success !")
        window.location = "/"
      } else {

      }
    })
    .fail(err => {
    
    })
  }
}
