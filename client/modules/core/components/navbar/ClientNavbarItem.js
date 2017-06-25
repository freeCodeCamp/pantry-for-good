import React from 'react'

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

export default ClientNavbarItem
