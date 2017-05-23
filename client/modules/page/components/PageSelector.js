import React from 'react'
import {connect} from 'react-redux'
import {Nav, NavItem} from 'react-bootstrap'

import selectors from '../../../store/selectors'

const mapStateToProps = state => ({
  pages: selectors.page.getAll(state)
})

const PageSelector = ({selectedPage, handlePageSelect, pages}) =>
  <Nav
    bsStyle="tabs"
    activeKey={selectedPage}
    onSelect={handlePageSelect}
  >
    {pages && pages.map(page =>
      <NavItem
        key={page.identifier}
        eventKey={page.identifier}
        title={page.title}
      >
        {page.title}
      </NavItem>
    )}
  </Nav>

export default connect(mapStateToProps)(PageSelector)
