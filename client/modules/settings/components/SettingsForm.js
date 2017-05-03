import React from 'react'
import {reduxForm} from 'redux-form'
import {Link} from 'react-router-dom'
import {Button, Clearfix, Col, Row} from 'react-bootstrap'

import {RFFieldGroup} from '../../../components/form'

const SettingsForm = ({onSubmit, handleSubmit}) =>
  <div>
    <Row>
      <Col lg={3}>
        <RFFieldGroup
          name="organization"
          label="Organization"
          type="text"
          required
        />
      </Col>
      <Clearfix visibleSmBlock visibleMdBlock />
      <Col lg={3}>
        <RFFieldGroup
          name="url"
          label="URL"
          type="text"
          required
        />
      </Col>
      <Clearfix visibleSmBlock visibleMdBlock />
      <Col lg={3}>
        <RFFieldGroup
          name="clientIntakeNumber"
          label="Client intake number"
          type="text"
          required
        />
      </Col>
      <Clearfix visibleSmBlock visibleMdBlock />
      <Col lg={3}>
        <RFFieldGroup
          name="supportNumber"
          label="Support number"
          type="text"
          required
        />
      </Col>
    </Row>

    <Row>
      <Col lg={6}>
        <RFFieldGroup
          name="mission"
          label="Mission"
          type="textarea"
          rows="5"
        />
      </Col>
      <Clearfix visibleSmBlock visibleMdBlock />
      <Col lg={6}>
        <RFFieldGroup
          name="instructions"
          label="Instructions to clients"
          type="textarea"
          rows="5"
        />
      </Col>
      <Clearfix />
      <Col lg={6}>
        <RFFieldGroup
          name="thanks"
          label="Thank you to donors"
          type="textarea"
          rows="5"
        />
      </Col>
      <Clearfix visibleSmBlock visibleMdBlock />
      <Col lg={6}>
        <RFFieldGroup
          name="foodBankAddress"
          label="Address"
          type="textarea"
          rows="5"
        />
      </Col>
    </Row>

    <Row>
      <Col lg={6}>
        <RFFieldGroup
          name="gmapsApiKey"
          label="Google Maps API Key"
        />
      </Col>
      <Col lg={6}>
        <RFFieldGroup
          name="gmapsClientId"
          label="Google Maps Client ID"
        />
      </Col>
    </Row>

    <div className="text-right">
      <Button
        onClick={handleSubmit}
        bsStyle="success"
      >
        Save Changes
      </Button>
      {' '}
      <Link to="/" className="btn btn-primary">
        Cancel
      </Link>
    </div>
  </div>

export default reduxForm({
  form: 'settingsForm',
  validate,
  warn
})(SettingsForm)

function validate(values) {
  let errors = {}

  if (!values.organization) {
    errors.organization = 'Organization name is required'
  }

  if (!values.url) {
    errors.url = 'URL is required'
  }

  if (!values.foodBankAddress) {
    errors.foodBankAddress = 'Address is required'
  }

  if (!values.clientIntakeNumber) {
    errors.clientIntakeNumber = 'Client Intake Number is required'
  }

  if (!values.supportNumber) {
    errors.supportNumber = 'Support Number is required'
  }

  return errors
}

function warn(values) {
  let warnings = {}

  if (!values.gmapsApiKey && !values.gmapsClientId) {
    warnings.gmapsApiKey = 'Maps require an API key or Client ID'
  }

  return warnings
}
