function getToken () {
  return JSON.parse(localStorage.getItem('token'));
}

function getTokenTimestamp () {
  return JSON.parse(localStorage.getItem('token_timestamp'));
}

function setToken (token) {
  localStorage.setItem('token', JSON.stringify(token));
  localStorage.setItem('token_timestamp', JSON.stringify(Date.now()));
}

function deleteToken () {
  if (Date.now() - getTokenTimestamp() >= 600000) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_timestamp');
  }
}

export {getToken, getTokenTimestamp, setToken, deleteToken}