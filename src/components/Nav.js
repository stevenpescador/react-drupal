import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { handleLogout } from '../actions/logout'

class Nav extends Component {
  logout = (e) => {
    e.preventDefault()
    this.props.dispatch(handleLogout())
  }
  render() {
    const loginLink = (
      <NavLink to='/login' activeClassName='active'>
        Login
      </NavLink>
    )
    const logoutLink = (
      <NavLink to='/logout' onClick={this.logout} activeClassName='active' >Logout</NavLink>
    )
    return (
      <nav className='nav'>
        <ul>
          <li>
            <NavLink to='/' exact activeClassName='active'>
              Home
            </NavLink>
          </li>
          <li>
            { !this.props.isAuthenticated ? loginLink : logoutLink }
          </li>
        </ul>
      </nav>
    )
  }
}

function mapStateToProps({ auth }) {
  const { isAuthenticated } = auth
  return {
    isAuthenticated
  }
}

export default connect(mapStateToProps)(Nav)