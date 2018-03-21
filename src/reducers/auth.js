import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE
} from '../actions/login'
import {
  LOGOUT_SUCCESS
} from '../actions/logout'
import { loadState } from '../utils/localStorage'
//localStorage.removeItem('current_user')
const persistedState = loadState()

const INITIAL_STATE = {
  isAuthenticated: false,
  errorMessage: '',
  basicAuth: '',
  csrf_token: '',
  ...persistedState
}

function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isAuthenticated: false,
        basicAuth: '',
        csrf_token: '',
      }
    case LOGIN_SUCCESS:
      const { basicAuth, csrf_token } = action.credentials
      return {
        ...state,
        isAuthenticated: true,
        basicAuth,
        csrf_token,
        errorMessage: ''
      }
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        basicAuth: '',
        csrf_token: '',
        errorMessage: action.message
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        basicAuth: '',
        csrf_token: '',
        isAuthenticated: false,
      }
    default:
      return state
  }
}

export default auth