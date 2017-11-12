import React from 'react'
import {connect} from 'react-redux'
import {sortBy} from 'lodash'
import {Nav, NavItem} from 'react-bootstrap'

import selectors from '../../../store/selectors'

const mapStateToProps = state => ({
  questionnaires: sortBy(selectors.questionnaire.getAll(state), 'name'),
  selected: selectors.qEditor.getEditingQuestionnaire(state)
})

const QuestionnaireSelector = ({
  questionnaires,
  selected,
  onSelect
}) =>
  <Nav
    bsStyle="tabs"
    activeKey={selected && selected.identifier}
    onSelect={onSelect}
  >
    {questionnaires && questionnaires.map(q =>
      <NavItem key={q.identifier} eventKey={q.identifier} title={q.name}>
        {q.name}
      </NavItem>
    )}
  </Nav>

export default connect(mapStateToProps)(QuestionnaireSelector)
