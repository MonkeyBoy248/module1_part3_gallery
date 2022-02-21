const tokenKey = 'token';

function getToken () {
  return JSON.parse(localStorage.getItem(tokenKey));
}

function getTokenTimestamp () {
  return JSON.parse(localStorage.getItem(tokenKey));
}

function setToken (token) {
  token.timestamp = Date.now();
  localStorage.setItem(tokenKey, JSON.stringify(token));
}

function deleteToken () {
  if (Date.now() - getTokenTimestamp().timestamp >= 600000) {
    localStorage.removeItem(tokenKey);
  }
}

export {
  getToken, 
  getTokenTimestamp, 
  setToken, 
  deleteToken
}