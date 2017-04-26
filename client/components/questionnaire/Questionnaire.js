import React from 'react'
import {reduxForm} from 'redux-form'
import {flatMap} from 'lodash'

import {Box, BoxHeader, BoxBody} from '../box'
import Section from './Section'
import validate from '../../../common/validators'

const Questionnaire = ({
  model,
  foods,
  questionnaire,
  loading,
  onSubmit
}) =>
  <div>
    {questionnaire && questionnaire.sections.map((section, i) =>
      <Box key={i}>
        <BoxHeader heading={section.name} />
        <BoxBody loading={loading}>
          {model && questionnaire &&
            <Section
              section={section}
              model={model}
              onSubmit={onSubmit}
            />
          }
        </BoxBody>
      </Box>
    )}
  </div>

export default reduxForm({
  validate: validateForm
})(Questionnaire)

function validateForm(values, props) {
  const fields = flatMap(props.questionnaire.sections, section => section.fields)

  return Object.keys(values).reduce((errors, k) => {
    const value = values[k]
    const field = fields.find(f => f._id === k)

    if (!field) return errors
    return Object.assign(errors, validate(value, field))
  }, {})
}
