import {Component} from 'react'
import {connect} from 'react-redux'

import selectors from '../../../store/selectors'

const mapStateToProps = state => ({
  route: state.router.location,
  settings: selectors.settings.getSettings(state),
  customers: selectors.customer.getAll(state),
  donors: selectors.donor.getAll(state),
  volunteers: selectors.volunteer.getAll(state)
})

const capitalizeFirstLetter = string => (
    string.charAt(0).toUpperCase() + string.slice(1)
)

class Title extends Component {
  componentDidUpdate() {
    let title = [this.props.settings.organization]
    const route = this.props.route.pathname.split('/')
    
    if(route.length > 1 && route[1] !== '') {
      title.unshift(capitalizeFirstLetter(route[1]))

      if(route.length > 2 && route[2] !== 'list') {
        const id = route[2]

        if (parseInt(id, 10)) {
          switch (route[1]) {
            case 'customers': {
              const customer = this.props.customers.find(c => c.id === id)
              title.unshift(customer.fullName)
              break
            }
            case 'donors': {
              const donor = this.props.donors.find(d => d.id === id)
              title.unshift(donor.fullName)
              break
            }
            case 'volunteers': {
              const volunteer = this.props.volunteers.find(v => v.id === id)
              title.unshift(volunteer.fullName)
              break
            }
          }
        } else {
          title.unshift(capitalizeFirstLetter(route[2]))
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
