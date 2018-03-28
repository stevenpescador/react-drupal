import React, { Component } from "react";
import { connect } from 'react-redux'

import Form from "react-jsonschema-form";
import EntityReference from "./widgets/EntityReference";

const log = (type) => console.log.bind(console, type);

class DrupalFormRender extends Component {
  state = {
    jsonSchema: '',
    uiSchema: '',
    formData: '',
  }
  baseUrl = 'http://localhost'
  handleChange (data) {}
  componentDidMount() {
    const { bundle, formMode, id } = this.props
    let url = `${this.baseUrl}/api/node/${bundle}`
    if (id !== '') {
      url += `/${id}`;
    }
    url += `?_format=schema_json`;
    if (formMode !== '') {
      url += `&_form_mode=${formMode}`;
    }
    fetch(url, {
      headers: {}
    })
      .then(response => response.json())
      .then(data => this.setState({
        jsonSchema: data.jsonSchema,
        uiSchema: data.uiSchema,
        formData: data.formData
      }));
  }
  processData(formData) {
    const { bundle } = this.props
    const data = Object.keys(formData).map(function(key) {
      let value = formData[key]
      let fieldType = ''
      if (this.state.uiSchema.hasOwnProperty(key)) {
        let fieldSchema = this.state.uiSchema[key]
        if (fieldSchema.hasOwnProperty('ui:field')) {
          fieldType = fieldSchema['ui:field'];
        }
      }
      //console.log(fieldType);
      switch(fieldType) {
        case 'entity_reference':
          return `"${key}": [{"target_id": ${value}}]`
        default:
          return `"${key}": [{"value": ${JSON.stringify(value)}}]`
      }
    }, this);
    // Add the bundle type.
    data.push(`"type": [{"target_id": "${bundle}"}]`)
    return '{' + data.join(', ') + '}'
  }

  onSubmit = async({formData}) => {
    try {
      const postData = this.processData(formData);
      const { basicAuth, csrf_token } = this.props
      let url = `${this.baseUrl}/entity/node?_format=json`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf_token,
          'Authorization': basicAuth,
        },
        body: postData
      });
      const data = await response.json();
      console.log('response', data)
    } catch (e) {
      console.log(e.message);
    }
  }

  render() {
    const { jsonSchema, uiSchema, formData } = this.state
    if (!jsonSchema) return <p>Loading...</p>;

    return (
      <div className='drupal-form-container'>
        <Form schema={jsonSchema}
              uiSchema={uiSchema}
              fields={{ entity_reference: EntityReference }}
              formData={formData}
              onChange={this.handleChange.bind(this)}
              onSubmit={this.onSubmit}
              onError={log("errors")} />
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  const { basicAuth, csrf_token } = auth
  return {
    basicAuth,
    csrf_token
  }
}
export default connect(mapStateToProps)(DrupalFormRender)