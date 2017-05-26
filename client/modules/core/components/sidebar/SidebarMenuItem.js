import React from 'react'
import {Link, NavLink} from 'react-router-dom'

const SidebarMenuItem = ({item, path}) =>
  <div>
    {item.menuItemType === 'treeview' ?
      <div>
        <NavLink
          to={`/${item.link}`}
          className="main-menuitem"
        >
          <span>{item.title}</span>
          <i className="fa fa-angle-left pull-right"></i>
        </NavLink>

        <ul className="treeview-menu">
          {item.items.map((subitem, i) =>
            <li
              className={subitem.link === path && 'active'}
              key={i}
            >
              <Link
                to={`/${subitem.link}`}
                className="sub-menuitem"
              >
                {subitem.title}
              </Link>
            </li>
          )}

        </ul>
      </div> :
      <Link to={`/${item.link}`} className="main-menuitem">
        <span>{item.title}</span>
      </Link>
    }
  </div>

export default SidebarMenuItem
