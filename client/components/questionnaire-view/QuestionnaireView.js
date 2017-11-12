import React from 'react'
import PropTypes from 'prop-types'

import {Box, BoxHeader, BoxBody} from '../box'
import SectionView from './SectionView'

import '../questionnaire/questionnaire.css'

const QuestionnaireView = ({
  model,
  questionnaire,
  loading,
}) =>
  <div>
    {questionnaire && questionnaire.sections.map((section, i) =>
      <Box key={i}>
        <BoxHeader heading={section.name} />
        <BoxBody loading={loading}>
          {model &&
            <SectionView
              section={section}
              model={model}
            />
          }
        </BoxBody>
      </Box>
    )}
  </div>

QuestionnaireView.propTypes = {
  model: PropTypes.shape({
    fields: PropTypes.array.isRequired
  }).isRequired,
  questionnaire: PropTypes.shape({
    sections: PropTypes.array.isRequired
  }),
  loading: PropTypes.bool
}

export default QuestionnaireView
