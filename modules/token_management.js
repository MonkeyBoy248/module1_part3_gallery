import { tokenKey, tokenTimestampKey } from "./environment_variables.js";

function getToken () {
  console.log(tokenKey);
  return JSON.parse(localStorage.getItem(tokenKey));
}

function getTokenTimestamp () {
  return JSON.parse(localStorage.getItem(tokenTimestampKey));
}

function setToken (token) {
  localStorage.setItem(tokenKey, JSON.stringify(token));
  localStorage.setItem(tokenTimestampKey, JSON.stringify(Date.now()));
}

function deleteToken () {
  if (Date.now() - getTokenTimestamp() >= 600000) {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(tokenTimestampKey);
  }
}

export {
  getToken, 
  getTokenTimestamp, 
  setToken, 
  deleteToken
}