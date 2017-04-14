import React from 'react'
import {reduxForm} from 'redux-form'
import {Link} from 'react-router-dom'

import {RFFieldGroup} from '../../../components/form'

const SettingsForm = ({onSubmit, handleSubmit}) =>
  <div>
    <div className="row">
      <div className="col-lg-3">
        <div className="form-group">
          <RFFieldGroup
            name="organization"
            label="Organization"
            type="text"
            required
          />
        </div>
      </div>
      <div className="clearfix visible-sm-block visible-md-block"></div>
      <div className="col-lg-2">
        <div className="form-group">
          <RFFieldGroup
            name="url"
            label="URL"
            type="text"
            required
          />
        </div>
      </div>
      <div className="clearfix visible-sm-block visible-md-block"></div>
      <div className="col-lg-2">
        <div className="form-group">
          <RFFieldGroup
            name="foodBankCity"
            label="City"
            type="text"
            required
          />
        </div>
      </div>
      <div className="col-lg-2">
        <div className="form-group">
          <RFFieldGroup
            name="clientIntakeNumber"
            label="Client intake number"
            type="text"
            required
          />
        </div>
      </div>
      <div className="clearfix visible-sm-block visible-md-block"></div>
      <div className="col-lg-3">
        <div className="form-group">
          <RFFieldGroup
            name="supportNumber"
            label="Support number"
            type="text"
            required
          />
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-lg-6">
        <div className="form-group">
          <RFFieldGroup
            name="mission"
            label="Mission"
            type="textarea"
            rows="5"
          />
        </div>
      </div>
      <div className="clearfix visible-sm-block visible-md-block"></div>
      <div className="col-lg-6">
        <div className="form-group">
          <RFFieldGroup
            name="instructions"
            label="Instructions to clients"
            type="textarea"
            rows="5"
          />
        </div>
      </div>
      <div className="clearfix"></div>
      <div className="col-lg-6">
        <div className="form-group">
          <RFFieldGroup
            name="thanks"
            label="Thank you to donors"
            type="textarea"
            rows="5"
          />
        </div>
      </div>
      <div className="clearfix visible-sm-block visible-md-block"></div>
      <div className="col-lg-6">
        <div className="form-group">
          <RFFieldGroup
            name="other"
            label="Other"
            type="textarea"
            rows="5"
            placeholder="For later use"
          />
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col-sm-6 col-md-4 col-lg-2">
        <button
          onClick={handleSubmit}
          className="btn btn-success btn-block top-buffer"
        >
          Save Changes
        </button>
      </div>
      <div className="col-sm-6 col-md-4 col-lg-2">
        <Link to="/" className="btn btn-primary btn-block top-buffer">
          Cancel
        </Link>
      </div>
    </div>
  </div>

export default reduxForm({
  form: 'settingsForm',
  validate,
  destroyOnUnmount: !module.hot
})(SettingsForm)

function validate(values) {
  let errors = {}

  if (!values.organization) {
    errors.organization = 'Organization name is required'
  }

  if (!values.url) {
    errors.url = 'URL is required'
  }

  if (!values.foodBankCity) {
    errors.foodBankCity = 'City is required'
  }

  if (!values.clientIntakeNumber) {
    errors.clientIntakeNumber = 'Client Intake Number is required'
  }

  if (!values.supportNumber) {
    errors.supportNumber = 'Support Number is required'
  }

  return errors
}
