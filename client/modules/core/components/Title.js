import {Component} from 'react'
import PropTypes from 'prop-types'
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
              const customer = this.props.getCustomer(id)
              customer && title.unshift(customer.fullName)
              break
            }
            case 'donors': {
              const donor = this.props.getDonor(id)
              donor && title.unshift(donor.fullName)
              break
            }
            case 'volunteers': {
              const volunteer = this.props.getVolunteer(id)
              volunteer && title.unshift(volunteer.fullName)
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

Title.propTypes = {
  settings: PropTypes.shape({
    organization: PropTypes.string
  }),
  route: PropTypes.shape({
    pathname: PropTypes.string
  }),
  getCustomer: PropTypes.func.isRequired,
  getDonor: PropTypes.func.isRequired,
  getVolunteer: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(Title)
