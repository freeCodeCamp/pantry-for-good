import React from 'react'
import {Nav, NavItem} from 'react-bootstrap'

const SectionForm = ({sections, selectedSection, onSelect}) =>
  <div>
    <h4>Sections</h4>
    <Nav
      bsStyle="pills"
      stacked
      className="bs-default-nav"
      activeKey={selectedSection}
      onSelect={onSelect}
    >
      {sections.map(section =>
        <NavItem
          key={section.position}
          eventKey={section.position}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {section.name}
            <span>
              <i className="fa fa-edit text-blue" onClick={() => {}}></i>{' '}
              <i className="fa fa-trash-o text-red" onClick={() => {}}></i>
            </span>
          </div>
        </NavItem>
      )}
    </Nav>
  </div>

export default SectionForm

