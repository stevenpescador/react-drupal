import React, { Component } from 'react'
import { connect } from 'react-redux'

class Login extends Component {
  state = {
    bundles: [],
    bundle: '',
    formModes: [],
    formMode: '',
    id: ''
  }
  handleBundleChange = (e) => {
    const bundle = e.target.value
    this.setState({ bundle })
    this.setDefaultFormMode(bundle)
  }
  setDefaultFormMode = (bundle) => {
    const { formModes } = this.state.bundles[bundle]
    const formMode = Object.keys(formModes)[0]
    this.setState({ formMode })
  }
  handleFormModeChange = (e) => {
    this.setState({ formMode: e.target.value })
  }
  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.renderForm(this.state)
  }
  componentDidMount() {
    fetch('http://localhost/api/form-modes')
      .then(response => {
        return response.json()
      }).then(bundles => {
        const bundle = Object.keys(bundles)[0]
        this.setState({
          bundles,
          bundle,
        })
        this.setDefaultFormMode(bundle)
    })
  }
  render() {
    const { bundles, bundle, formMode, id } = this.state
    if (bundles.length === 0) return <p>Loading...</p>
    const { formModes } = bundles[bundle]
    return (
      <div>
        <form className='add-form' onSubmit={this.handleSubmit}>
          <select name='bundle' className='input' onChange={this.handleBundleChange}>
            {Object.keys(bundles).map(function(key) {
              return <option key={key} value={key}>{bundles[key].label}</option>
            })}
          </select>
          {Object.keys(formModes).length > 1 &&
            <select className='input' onChange={this.handleFormModeChange}>
              {Object.keys(formModes).map(function (key) {
                return <option key={key} value={key}>{formModes[key]}</option>
              })}
            </select>
          }
          <input className='input' onChange={this.handleInputChange} type='number'
                 name='id' value={id} placeholder='#optional edit id#' />
          <button className='btn' type='submit'>
            Render
          </button>
        </form>
      </div>
    )
  }
}

export default connect()(Login)