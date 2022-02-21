const galleryPhotos = document.querySelector('.gallery__photos');
const galleryTemplate = document.querySelector('.gallery__template');
const pagesLinksContainer = document.querySelector('.gallery__links-list');
const galleryErrorMessage = document.querySelector('.gallery__error-message');
const galleryPopup = document.querySelector('.gallery__error-pop-up');
const galleryServerUrl = 'https://hjdjs55gol.execute-api.us-east-1.amazonaws.com/api/gallery';
const currentUrl = new URL(window.location.href);
const loginUrl = new URL(`${currentUrl.href.slice(0, currentUrl.href.lastIndexOf('/'))}/authentication.html`);

async function getPicturesData (url) {
  if (getToken()) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getToken().token,
        },
      })
    
      const data = await response.json();
      createPictureTemplate(data);
    } catch {
      showMessage(`There is no page with number ${url.charAt(url.length - 1)}. Please, enter a new value in the address bar`);
    }
  }
}

function getToken () {
  return JSON.parse(localStorage.getItem('token'));
}

function getTokenTimestamp () {
  return JSON.parse(localStorage.getItem('token_timestamp'));
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
  window.location = window.location.origin + window.location.pathname + `?page=${params}`;
}

function deleteToken () {
  if (Date.now() - getTokenTimestamp() >= 600000) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_timestamp');
  }
}

function showMessage (text) {
  galleryPopup.classList.add('show');
  galleryErrorMessage.textContent = '';
  galleryErrorMessage.textContent = text;
}

function timer (timer) {
  let time = setInterval(() => {
    --timer;
    if (timer <= 0) clearInterval(time);
    showMessage(`Token validity time is expired. You will be redirected to authorization page in ${timer} seconds`);
  }, 1000);
}

function redirectWhenTokenExpires (delay) {
  if (!getToken()) {
    timer(delay / 1000);
    setTimeout(() => {
      window.location.replace(`${loginUrl}?currentPage=${currentUrl.searchParams.get('page')}`);
    }, delay)
  }
}

document.addEventListener('DOMContentLoaded', () => { 
  if(!currentUrl.searchParams.get('page')) {
    getPicturesData(`${galleryServerUrl}?page=1`);
  }else {
    getPicturesData(`${galleryServerUrl}?page=${currentUrl.searchParams.get('page')}`);
  }

  const currentActiveLink = pagesLinksContainer.querySelector('.active');
  
  for (let link of pagesLinksContainer.children) {
    link.setAttribute('page-number', link.querySelector('a').textContent);

    if (link.getAttribute('page-number') === currentUrl.searchParams.get('page')) {
      currentActiveLink.classList.remove('active');
      link.classList.add('active');
    }
  }

  redirectWhenTokenExpires(5000);
})

pagesLinksContainer.addEventListener('click', (e) => {
  const currentActiveLink = pagesLinksContainer.querySelector('.active');
  e.preventDefault();
  const target = e.target.closest('li');

  if (currentActiveLink !== target) {
    setNewUrl(target.getAttribute('page-number'));
    getPicturesData(`${galleryServerUrl}?page=${currentUrl.searchParams.get('page')}`);
    
    currentActiveLink.classList.remove('active');
    target.classList.add('active');

    redirectWhenTokenExpires(5000);
  }
})

setInterval(() => {
  deleteToken();
  redirectWhenTokenExpires(5000);
}, 300000)






