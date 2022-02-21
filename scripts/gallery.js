import { getToken, getTokenTimestamp, deleteToken } from "../modules/token_management.js";
import { galleryServerUrl, loginUrl } from "../modules/environment_variables.js";
import removeEventListeners from "../modules/event_listeners_management.js";

const galleryPhotos = document.querySelector('.gallery__photos');
const galleryTemplate = document.querySelector('.gallery__template');
const pagesLinksContainer = document.querySelector('.gallery__links-list');
const galleryErrorMessage = document.querySelector('.gallery__error-message');
const galleryPopup = document.querySelector('.gallery__error-pop-up');
const currentUrl = new URL(window.location.href);
const galleryEventsArray = [
  {target: document, type: 'DOMContentLoaded', handler: getCurrentPageImages},
  {target: pagesLinksContainer, type: 'click', handler: changeCurrentPage},
]

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

function showMessage (text) {
  galleryPopup.classList.add('show');
  galleryErrorMessage.textContent = '';
  galleryErrorMessage.textContent = text;
}

function updateMessageBeforeRedirection (timer) {
  let time = setInterval(() => {
    --timer;
    if (timer <= 0) clearInterval(time);
    showMessage(`Token validity time is expired. You will be redirected to authorization page in ${timer} seconds`);
  }, 1000);
}

function redirectWhenTokenExpires (delay) {
  if (!getToken()) {
    updateMessageBeforeRedirection(delay / 1000);
    removeEventListeners(galleryEventsArray);
    setTimeout(() => {
      window.location.replace(`${loginUrl}?currentPage=${currentUrl.searchParams.get('page')}`);
    }, delay)
  }
}

function getCurrentPageImages () {
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
}

function changeCurrentPage (e) {
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
}

document.addEventListener('DOMContentLoaded', getCurrentPageImages);
pagesLinksContainer.addEventListener('click', changeCurrentPage);

setInterval(() => {
  deleteToken();
  redirectWhenTokenExpires(5000);
}, 300000)







