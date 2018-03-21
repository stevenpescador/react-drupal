export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

function logoutRequest() {
  return {
    type: LOGOUT_REQUEST
  }
}

function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
    isAuthenticated: false
  }
}

// Logs the user out
export function handleLogout() {
  return dispatch => {
    dispatch(logoutRequest())
    localStorage.removeItem('current_user')
    dispatch(logoutSuccess())
  }
}