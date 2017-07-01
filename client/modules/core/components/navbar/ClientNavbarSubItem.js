import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class ClientNavbarSubItem extends Component {
  constructor(props) {
    super(props)
    this.state = {active: false}
  }
  componentWillMount() {
    this.updateActive(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.updateActive(nextProps)
  }
  updateActive = props => {
    const {item, path} = props
    const active = item.link && item.link === path

    if (active !== this.state.active) {
      this.setState({active})
      this.props.setActive(active)
    }
  }
  render() {
    const {item} = this.props

    return item.type === 'divider' ?
      <li className="divider"></li> :
      <li className={this.state.active ? 'active' : ''}>
        <Link to={`/${item.link}`}>{item.title}</Link>
      </li>
  }
}

export default ClientNavbarSubItem
