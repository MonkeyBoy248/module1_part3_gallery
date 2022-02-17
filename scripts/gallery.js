const galleryPhotos = document.querySelector('.gallery__photos');
const galleryTemplate = document.querySelector('.gallery__template');
const pagesLinksContainer = document.querySelector('.gallery__pages');
const galleryErrorMessage = document.querySelector('.gallery__error-message');
const galleryUrl = 'https://hjdjs55gol.execute-api.us-east-1.amazonaws.com/api/gallery';
const loginUrl = new URL('http://127.0.0.1:5500/pages/authentication.html');
const currentUrl = new URL(window.location.href);


async function getPicturesData (url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'token',
      },
    })
  
    const data = await response.json();
    createPictureTemplate(data);
    setNewUrl(data);
    galleryErrorMessage.textContent = '';
  } catch {
    galleryErrorMessage.textContent = 'Невозможно получить страницу с таким номером! Попробуйте выбрать другую страницу';
  }
}

function getToken () {
  return JSON.parse(localStorage.getItem('token'));
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

function setNewUrl (params) {
  const newUrl = new URL(`?page=${params.page}`, currentUrl);
  history.pushState(null, null, newUrl);
}

function deleteToken () {
  if (Date.now() - JSON.parse(localStorage.getItem('token_timestamp')) >= 20000) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_timestamp');
  }
}

function redirectWhenExpires () {
  if (!getToken()) {
    window.location.replace(`${loginUrl}?currentPage=${currentUrl.searchParams.get('page')}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {  
  if(!currentUrl.searchParams.get('page')) {
    getPicturesData(`${galleryUrl}?page=1`);
  }else {
    getPicturesData(`${galleryUrl}?page=${currentUrl.searchParams.get('page')}`);
  }

  const currentActiveLink = pagesLinksContainer.querySelector('.active');
  
  for (let link of pagesLinksContainer.children) {
    if (link.textContent == currentUrl.searchParams.get('page')) {
      currentActiveLink.classList.remove('active');
      link.classList.add('active');
    }
  }

  redirectWhenExpires();
})

pagesLinksContainer.addEventListener('click', (e) => {
  const currentActiveLink = pagesLinksContainer.querySelector('.active');
  e.preventDefault();
  if (currentActiveLink !== e.target) {
    currentUrl.searchParams.set('page', e.target.textContent);
    
    getPicturesData(`${galleryUrl}?page=${currentUrl.searchParams.get('page')}`);
    currentActiveLink.classList.remove('active');
    e.target.classList.add('active');

    redirectWhenExpires();
  }
})

setInterval(() => {
  deleteToken();
  redirectWhenExpires();
}, 300000)




