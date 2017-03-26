import React from 'react'
import {sortBy} from 'lodash'

const SidebarMenuItem = ({item, user, route, push}) =>
  <div>
    {item.menuItemType === 'treeview' ?
      <div>
        <a
          href={`#!/${item.link}`}
          onClick={() => push(item.uiRoute)}
          className="main-menuitem"
        >
          <span>{item.title}</span>
          <i className="fa fa-angle-left pull-right"></i>
        </a>

        <ul className="treeview-menu">
          {item.items.map(subitem =>
            <li
              className={route === subitem.uiRoute && 'active'}
              key={subitem.uiRoute}
            >
              <a
                href={`#!/${subitem.link}`}
                className="sub-menuitem"
              >
                {subitem.title}
              </a>
            </li>
          )}

        </ul>
      </div> :
      <a href={`#!/${item.link}`} className="main-menuitem">
        <span>{item.title}</span>
      </a>
    }
  </div>

export default SidebarMenuItem
