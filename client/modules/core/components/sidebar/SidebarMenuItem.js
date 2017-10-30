import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {head, tail} from 'lodash'

const SidebarMenuItem = ({item, path, depth}) => {
  const active = item.link.split('/')[depth] === head(path) ? 'active' : ''

  return item.type === 'treeview' ?
    <li className={`treeview ${active}`}>
      <a
        href="/#"
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

SidebarMenuItem.propTypes = {
  item: PropTypes.shape({
    items: PropTypes.array,
    link: PropTypes.string.isRequired,
    type: PropTypes.string,
    title: PropTypes.string
  }).isRequired,
  path: PropTypes.array,
  depth: PropTypes.number
}

export default SidebarMenuItem
