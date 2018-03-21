import { combineReducers } from 'redux'
import auth from './auth'
import { loadingBarReducer } from 'react-redux-loading'

export default combineReducers ({
  auth,
  loadingBar: loadingBarReducer
})