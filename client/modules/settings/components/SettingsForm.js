import React from 'react'
import PropTypes from 'prop-types'
import {compose, setPropTypes} from 'recompose'
import {reduxForm} from 'redux-form'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import General from './General'
import ReceiptFields from './ReceiptFields'
import Keys from './Keys'
import Images from './Images'
import withConfirmNavigation from '../../../components/withConfirmNavigation'

const enhance = compose(
  setPropTypes({
    onSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object
  }),
  reduxForm({
    form: 'settingsForm',
    enableReinitialize: true,
    validate,
    warn
  }),
  withConfirmNavigation
)

const SettingsForm = ({handleSubmit}) =>
  <div>
    <General />
    <ReceiptFields />
    <Images />
    <Keys />

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

export default enhance(SettingsForm)

function validate(values) {
  let errors = {}
  
  if (!values.organization || /^\s+$/.test(values.organization)) {
    errors.organization = 'Organization name is required'
  }

  if (!values.url) {
    errors.url = 'URL is required'
  }

  if (!values.address) {
    errors.address = 'Address is required'
  }

  if (!values.clientIntakeNumber) {
    errors.clientIntakeNumber = 'Client Intake Number is required'
  }

  if (!values.supportNumber) {
    errors.supportNumber = 'Support Number is required'
  }

  if (!values.distanceUnit) {
    errors.distanceUnit = 'Distance Unit is required'
  }

  if (!values.moneyUnit) {
    errors.moneyUnit = 'Money Unit is required'
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
