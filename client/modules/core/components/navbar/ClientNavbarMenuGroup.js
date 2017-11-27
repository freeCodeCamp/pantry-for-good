import React from 'react'
import PropTypes from 'prop-types'
import {matchPath, withRouter} from 'react-router-dom'

const ClientNavbarMenuGroup = ({children, history, title}) => {
  const active = React.Children.toArray(children)
    .filter(child => child.props.path)
    .some(child => matchPath(history.location.pathname, child.props.path, true))

  return (
    <li className={active && 'active'}>
      <a className="dropdown-toggle" data-toggle="dropdown">
        {title}
        <span className="caret"></span>
      </a>
      <ul className="dropdown-menu" role="menu">
        {children}
      </ul>
    </li>
  )
}

ClientNavbarMenuGroup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  history: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
}

export default withRouter(ClientNavbarMenuGroup)
