const loginForm = document.forms.login;
const emailInput = loginForm.elements.email;
const passwordInput = loginForm.elements.password;
const submitButton = loginForm.elements.submit;
const submitErrorContainer = loginForm.querySelector('.login-form__submit-error-message');
const url = 'https://hjdjs55gol.execute-api.us-east-1.amazonaws.com/api/login';

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
    return data;
  } catch (err) {
    submitErrorContainer.textContent = `${err.errorMessage}`;
  }
}

function setToken (token) {
  localStorage.setItem('token', JSON.stringify(token));
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
  sendFormData(url)
  .then(token => setToken(token))
  .then(setTimeout(deleteToken, 600000));
  emailInput.value = '';
  passwordInput.value = '';
})

loginForm.addEventListener('focusin', () => {
  submitErrorContainer.textContent = '';
})



