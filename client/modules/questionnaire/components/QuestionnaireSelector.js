import React from 'react'
import {Nav, NavItem} from 'react-bootstrap'

const QuestionnaireSelector = ({selected, questionnaires, onSelect}) =>
  <Nav
    bsStyle="tabs"
    activeKey={selected.identifier}
    onSelect={onSelect}
  >
    {questionnaires.map(q =>
      <NavItem key={q.identifier} eventKey={q.identifier} title={q.name}>
        {q.name}
      </NavItem>
    )}
  </Nav>

export default QuestionnaireSelector
