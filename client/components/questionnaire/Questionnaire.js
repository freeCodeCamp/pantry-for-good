import React from 'react'
import {compose} from 'recompose'
import {reduxForm} from 'redux-form'
import {flatMap} from 'lodash'
import {utc} from 'moment'

import {Box, BoxHeader, BoxBody} from '../box'
import withConfirmNavigation from '../withConfirmNavigation'
import Section from './Section'
import validate from '../../../common/validators'

import './questionnaire.css'

const Questionnaire = ({
  questionnaire,
  loading,
  onSubmit
}) =>
  <div>
    {questionnaire && questionnaire.sections.map((section, i) =>
      <Box key={i}>
        <BoxHeader heading={section.name} />
        <BoxBody loading={loading}>
          <Section
            section={section}
            onSubmit={onSubmit}
          />
        </BoxBody>
      </Box>
    )}
  </div>

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
  return Object.keys(values.fields).reduce((errors, k) => {
    const value = values.fields[k]
    const field = allFields.find(f => f._id === k)

    if (!field) return errors
    return Object.assign(errors, validate(value, field))
  }, {})
}
