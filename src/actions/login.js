import { showLoading, hideLoading } from 'react-redux-loading'
//import { loginUser } from '../utils/api'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

function loginRequest() {
  return {
    type: LOGIN_REQUEST,
  }
}

function loginSuccess(credentials) {
  return {
    type: LOGIN_SUCCESS,
    credentials,
  }
}

function loginFailure(message) {
  return {
    type: LOGIN_FAILURE,
    message
  }
}

export function handleLogin({ username, password}) {
  const url = 'http://localhost/user/login?_format=json'
  let config = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: username,
      pass: password,
    })
  }
  return (dispatch) => {
    dispatch(showLoading())
    dispatch(loginRequest())
    return fetch(url, config)
      .then(response =>
        response.json().then(result => ({result, status: response.status}))
      .then(({result, status}) => {
        switch (status) {
          case 200:
            const basicAuth = formatBasicAuth(username, password)
            const currentUser = {
              basicAuth,
              csrf_token: result.csrf_token
            }
            const serializedUser = JSON.stringify(currentUser)
            localStorage.setItem('current_user', serializedUser)
            dispatch(loginSuccess(currentUser))
            break
          case 400:
            console.log('400 response:', result.message)
            break
          default:
            console.log('Unknown response:', status)
        }
      })
      .then(() => dispatch(hideLoading()))
      .catch(err => console.log("Error: ", err)))
  }
}

function formatBasicAuth(userName, password) {
  var basicAuthCredential = userName + ":" + password;
  var base64 =  btoa(basicAuthCredential);
  return 'Basic ' + base64;
}
