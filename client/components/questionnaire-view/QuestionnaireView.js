import React from 'react'

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

export default QuestionnaireView
