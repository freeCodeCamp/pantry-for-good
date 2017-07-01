import React, {Component} from 'react'
import {compose} from 'recompose'
import {reduxForm} from 'redux-form'
import {flatMap} from 'lodash'
import {utc} from 'moment'

import {Box, BoxHeader, BoxBody} from '../box'
import withConfirmNavigation from '../withConfirmNavigation'
import Section from './Section'
import validate from '../../../common/validators'

import './questionnaire.css'

class Questionnaire extends Component {
  render() {
    const {questionnaire, loading} = this.props
    return (
      <div>
        {questionnaire && questionnaire.sections.map((section, i) =>
          <Box key={i}>
            <BoxHeader heading={section.name} />
            <BoxBody loading={loading}>
              <Section section={section} />
            </BoxBody>
          </Box>
        )}
      </div>
    )
  }
}

export default compose(
  reduxForm({
    validate: validateForm,
    enableReinitialize: true
  }),
  withConfirmNavigation
)(Questionnaire)

function validateForm(values, props) {
  const allFields = flatMap(props.questionnaire.sections, section => section.fields)

  return {
    fields: validateQuestionnaireFields(values, allFields),
    household: validateHousehold(values, allFields)
  }
}

function validateHousehold(values, allFields) {
  if (!allFields.find(field => field.type === 'household')) return

  return values.household.reduce((errors, row) => {
    let rowErrors = {}
    if (!row || !row.name)
      rowErrors.name = 'Name is required'
    if (!row || !row.relationship)
      rowErrors.relationship = 'Relationship is required'
    if (!row || !utc(row.dateOfBirth).isValid())
      rowErrors.dateOfBirth = 'Date of Birth is required'

    return errors.concat(rowErrors)
  }, [])
}

function validateQuestionnaireFields(values, allFields) {
  return allFields.reduce((errors, qField) => {
    const fieldId = Object.keys(values.fields).find(id => id === qField._id)
    return {
      ...errors,
      ...validate(values.fields[fieldId], qField)
    }
  }, {})
}
