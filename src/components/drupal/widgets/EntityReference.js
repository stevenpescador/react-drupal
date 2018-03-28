import React from 'react';

export default class EntityRef extends React.Component {
  constructor(props) {
    super(props);
    const value = props.formData || ''
    this.state = {
      value,
      suggestions: []
    }
    this.baseUrl = 'http://localhost'
    // If editing node set parent form value to id only.
    if (value !== '') {
      props.onChange(this.matchEntityIdFromValue(value))
    }
  }
  onChange() {
    return async(event) => {
      const value = event.target.value
      const trimmedValue = value.trim()
      let suggestions = []
      if (trimmedValue.length > 0) {
        suggestions = await this.fetchSuggestions(trimmedValue)
      }
      this.setState({
        value,
        suggestions
      })
    }
  }
  fetchSuggestions = async(value) => {
    try {
      const { bundle, key } = this.props.schema;
      const url = `${this.baseUrl}/entity_reference_autocomplete/${bundle}/default%3A${bundle}/${key}?q=${value}`
      const res = await fetch(url)
      return await res.json()
    } catch (e) {
      console.log(e.message)
    }
  };
  onBlur() {
    return (event) => {
      this.setState({
        suggestions: []
      })
    }
  }
  matchEntityIdFromValue (value) {
    const [ label, id ] = value.match(/.+\s\(([^)]+)\)/)
    return id;
  }
  onSelect(value) {
    return (event) => {
      const { onChange } = this.props
      this.setState({
        value,
        suggestions: []
      })
      // Send entity id to parent formData.
      onChange(this.matchEntityIdFromValue(value))
    }
  }
  render() {
    const { value, suggestions } = this.state
    const { title } = this.props.schema
    return (
      <div>
        <label>{ title }</label>
        <input type="string" value={value} onChange={this.onChange()} onBlur={this.onBlur()} />
        {suggestions.length > 0 &&
        <div className="suggestion-container">
          <ul>
            {suggestions.map((item) =>
              <li key={item.value} onMouseDown={this.onSelect(item.value)}>{item.label}</li>
            )}
          </ul>
        </div>}
      </div>
    )
  }
}