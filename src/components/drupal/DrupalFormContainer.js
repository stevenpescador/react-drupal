import React, { Component } from 'react'
import { connect } from 'react-redux'
import DrupalFormBuilder from './DrupalFormBuilder'
import DrupalForm from './DrupalForm'

class DrupalFormContainer extends Component {
  state = {
    bundle: '',
    formMode: '',
  }
  renderForm = ({bundle, formMode, id}) => {
    this.setState({
      bundle,
      formMode,
      id
    })
  }
  render() {
    const { bundle, formMode, id } = this.state
    const { isAuthenticated } = this.props
    const key = bundle + formMode + id
    if (!isAuthenticated) {
      return <p>You must log in to use this.</p>
    }
    return (
      <div>
        <DrupalFormBuilder renderForm={this.renderForm} />
        {bundle !== '' &&
          <DrupalForm key={key} bundle={bundle} formMode={formMode} id={id} />
        }
      </div>
    )
  }
}
function mapStateToProps({ auth }) {
  const { isAuthenticated } = auth
  return {
    isAuthenticated
  }
}
export default connect(mapStateToProps)(DrupalFormContainer)