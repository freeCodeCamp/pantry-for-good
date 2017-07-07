import {Component} from 'react'
import {connect} from 'react-redux'
import {capitalize, get} from 'lodash'

import selectors from '../../../store/selectors'

const mapStateToProps = state => ({
  route: state.router.location,
  settings: selectors.settings.getSettings(state),
  getCustomer: selectors.customer.getOne(state),
  getDonor: selectors.donor.getOne(state),
  getVolunteer: selectors.volunteer.getOne(state)
})

class Title extends Component {
  componentDidUpdate() {
    let title = [get(this.props.settings, 'organization', '')]
    const route = this.props.route.pathname.split('/')

    if(route.length > 1 && route[1] !== '') {
      title.unshift(capitalize(route[1]))

      if(route.length > 2 && route[2] !== 'list') {
        const id = parseInt(route[2], 10)

        if (id) {
          switch (route[1]) {
            case 'customers': {
              title.unshift(this.props.getCustomer(id).fullName)
              break
            }
            case 'donors': {
              title.unshift(this.props.getDonor(id).fullName)
              break
            }
            case 'volunteers': {
              title.unshift(this.props.getVolunteer(id).fullName)
              break
            }
          }
        } else {
          title.unshift(capitalize(route[2]))
        }
      }
    }

    document.title = title.join(' - ')
  }

  render() {
    return null
  }
}

export default connect(mapStateToProps)(Title)
