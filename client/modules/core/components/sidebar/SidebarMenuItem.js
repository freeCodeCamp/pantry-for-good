import React from 'react'
import {Link} from 'react-router-dom'
import {head, tail} from 'lodash'

const SidebarMenuItem = ({item, path, depth}) => {
  const active = item.link.split('/')[depth] === head(path) ? 'active' : ''

  return item.menuItemType === 'treeview' ?
    <li className={`treeview ${active}`}>
      <a href="/#"
        className={!depth ? 'main-menuitem' : 'sub-menuitem'}
      >
        {item.title}
        <span></span>
      </a>
      <ul className="treeview-menu">
        {item.items && item.items.map((subitem, i) =>
          <SidebarMenuItem key={i} item={subitem} path={tail(path)} depth={depth + 1} />
        )}
      </ul>
    </li> :
    <li className={active}>
      <Link to={`/${item.link}`} className={!depth ? 'main-menuitem' : 'sub-menuitem'}>
        <span>{item.title}</span>
      </Link>
    </li>
}

export default SidebarMenuItem
