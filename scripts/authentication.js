const loginForm = document.forms.login;
const emailInput = loginForm.elements.email;
const passwordInput = loginForm.elements.password;
const submitButton = loginForm.elements.submit;
const submitErrorContainer = loginForm.querySelector('.login-form__submit-error-message');
const authenticationUrl = 'https://hjdjs55gol.execute-api.us-east-1.amazonaws.com/api/login';
const currentUrl = new URL(window.location.href);
const galleryUrl = new URL(`${currentUrl.href.slice(0, currentUrl.href.lastIndexOf('/'))}/index.html`);
console.log(galleryUrl);
const currentPage = currentUrl.searchParams.get('currentPage');

function validateField (field, pattern, text) {
  const targetErrorContainer = loginForm.querySelector(`.login-form__${field.name}-error-message`);
  targetErrorContainer.textContent = '';
  submitButton.disabled = false;
  submitButton.classList.remove('_disabled')
  field.classList.remove('invalid');

  if (field.value.length !== 0 && !pattern.test(field.value)) {
    targetErrorContainer.textContent = `${text}`;
    submitButton.disabled = true;
    submitButton.classList.add('_disabled');
    field.classList.add('invalid');
  }
}

async function sendFormData (url) {
  const user = {
    email: emailInput.value,
    password: passwordInput.value,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user),
    })
  
    const data = await response.json();
    console.log(data);

    if ('token' in data) return data;

    submitErrorContainer.textContent = `${data.errorMessage}`;
  } catch (err) {
    console.log(err);
  }
}

function setToken (token) {
  localStorage.setItem('token', JSON.stringify(token));
  localStorage.setItem('token_timestamp', JSON.stringify(Date.now()));
}

function getToken () {
  return JSON.parse(localStorage.getItem('token'));
}

function deleteToken () {
  localStorage.removeItem('token');
}

emailInput.addEventListener('input', () => {
  const message = 'Wrong email format. Please, try again';
  const pattern = /[\w\d-_]+@([\w_-]+\.)+[\w]+/;

  validateField(emailInput, pattern, message);
})

passwordInput.addEventListener('change', () => {
  const message = 'Wrong password format. Please, try again';
  const pattern = /([a-zA-Z0-9]{8,})/;

  validateField(passwordInput, pattern, message);
})

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendFormData(authenticationUrl)
  .then(data => {
    if (data) {
      setToken(data)
    }
  })
  .then(() => {
    if (getToken()) {
      if (!currentUrl.searchParams.get('currentPage')) {
        window.location.replace(`${galleryUrl}?page=1`)
      } else {
        window.location.replace(`${galleryUrl}?page=${currentPage}`)
      }
    }
  }
  )
  
  emailInput.value = '';
  passwordInput.value = '';
  
})

loginForm.addEventListener('focusin', () => {
  submitErrorContainer.textContent = '';
})






