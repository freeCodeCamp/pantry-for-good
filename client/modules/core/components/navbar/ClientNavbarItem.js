import React from 'react'
import PropTypes from 'prop-types'

import ClientNavbarSubItem from './ClientNavbarSubItem'

const ClientNavbarItem = ({item, path, active, setActive}) =>
  item.type === 'treeview' ?
    <li className={`dropdown ${active ? 'active' : ''}`}>
      <a href="#" className="dropdown-toggle" data-toggle="dropdown">
        {item.title}
        <span className="caret"></span>
      </a>
      <ul className="dropdown-menu" role="menu">
        {item.items && item.items.map((subitem, i) =>
          <ClientNavbarSubItem
            key={i}
            item={subitem}
            path={path}
            setActive={setActive(i)}
          />
        )}
      </ul>
    </li> :
    <ClientNavbarSubItem
      item={item}
      path={path}
      setActive={setActive(0)}
    />

ClientNavbarItem.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.array
  }).isRequired,
  path: PropTypes.string,
  active: PropTypes.bool,
  setActive: PropTypes.func.isRequired
}

export default ClientNavbarItem
