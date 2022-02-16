const galleryPhotos = document.querySelector('.gallery__photos');
const galleryTemplate = document.querySelector('.gallery__template');
const galleryUrl = 'https://hjdjs55gol.execute-api.us-east-1.amazonaws.com/api/gallery';

async function getPicturesData (url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'token',
      },
    })
  
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

function getToken () {
  JSON.parse(localStorage.getItem('token'));
}

function createPictureTemplate (pictures) {
  galleryPhotos.innerHTML = ''

  for (let object of pictures.objects) {
    const picture = galleryTemplate.content.cloneNode(true).children[0];
    const image = picture.querySelector('.gallery__img');
    
    image.setAttribute('src', object);

    galleryPhotos.append(image);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getPicturesData(galleryUrl)
  .then(data => createPictureTemplate(data));
})

