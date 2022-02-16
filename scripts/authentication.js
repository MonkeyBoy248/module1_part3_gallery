const loginForm = document.forms.login;
const emailInput = loginForm.elements.email;
const passwordInput = loginForm.elements.password;
const submitButton = loginForm.elements.submit;

function validateField (field, pattern, text) {
  loginForm.querySelector(`.login-form__${field.name}-error-message`).innerHTML = '';
  submitButton.setAttribute('disabled', false);
  submitButton.classList.remove('_disabled')

  if (field.value.length !== 0 && !pattern.test(field.value)) {
    loginForm.querySelector(`.login-form__${field.name}-error-message`).innerHTML = `${text}`;
    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('_disabled')
  }
}

emailInput.addEventListener('input', () => {
  const message = 'Wrong email format. Please, try again';
  const pattern = /[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+/;

  validateField(emailInput, pattern, message);
})

passwordInput.addEventListener('change', () => {
  const message = 'Wrong password format. Please, try again';
  const pattern = /([a-zA-Z0-9]{8,})/;

  validateField(passwordInput, pattern, message);
})


