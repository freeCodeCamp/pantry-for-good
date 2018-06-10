import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {loadCustomers} from '../../customer/reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {loadSettings} from '../../settings/reducers/settings'
import {loadVolunteer, saveVolunteer} from '../../volunteer/reducer'
import {
  // requestMapquestRoute,
  requestGoogleRoute,
  setAllWaypoints,
  clearRoute
} from '../reducers/route'

import {Page, PageBody} from '../../../components/page'
import {Box, BoxBody, BoxHeader} from '../../../components/box'
import RouteOrder from './route/RouteOrder'
// import RouteMap from './route/mapbox/RouteMap'
import RouteMap from './route/googlemap/RouteMap'

const mapStateToProps = (state, ownProps) => ({
  driver: selectors.volunteer.getOne(state)(ownProps.match.params.driverId),
  questionnaires: selectors.questionnaire.getAll(state),
  settings: selectors.settings.getSettings(state),
  waypoints: selectors.delivery.route.getWaypoints(state),
  allWaypoints: selectors.delivery.route.getAllWaypoints(state),
  origin: selectors.delivery.route.getOrigin(state),
  destination: selectors.delivery.route.getDestination(state),
  loading: selectors.volunteer.loading(state) || selectors.customer.loading(state) ||
    selectors.questionnaire.loading(state) || selectors.settings.fetching(state),
  loadError: selectors.volunteer.loadError(state) || selectors.customer.loadError(state) ||
    selectors.questionnaire.loadError(state) || selectors.settings.error(state),
  routeError: selectors.delivery.route.hasError(state),
  routeLoading: selectors.delivery.route.isFetching(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  load: () => {
    dispatch(loadVolunteer(ownProps.match.params.driverId))
    dispatch(loadQuestionnaires())
    dispatch(loadSettings())
    dispatch(loadCustomers())
    dispatch(clearRoute())
  },
  saveDriver: driver => dispatch(saveVolunteer(driver)),
  // requestRoute: waypoints => dispatch(requestMapquestRoute(waypoints)),
  // requestOptimized: waypoints => dispatch(requestMapquestRoute(waypoints, true)),
  requestRoute: waypoints => dispatch(requestGoogleRoute(waypoints)),
  requestOptimized: waypoints => dispatch(requestGoogleRoute(waypoints, true)),
  setAllWaypoints: waypoints => dispatch(setAllWaypoints(waypoints)),
})

class DriverRoute extends Component {
  componentWillMount() {
    this.props.load()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading) {
      nextProps.setAllWaypoints([
        nextProps.settings,
        ...nextProps.driver.customers,
        nextProps.driver
      ])
    }
  }

  requestRoute = () => this.props.requestRoute(this.props.allWaypoints)

  requestOptimized = () => this.props.requestOptimized(this.props.allWaypoints)

  getGoogleUrl = () => {
    const urlBase = 'https://www.google.com/maps/dir/'
    return urlBase + encodeURI(this.props.allWaypoints.map(point =>
      `${point.address}/`))
  }

  render() {
    const {driver, settings, waypoints, loading, loadError, routeError, routeLoading} = this.props

    return (
      <Page>
        <PageBody>
          <div style={{display: 'flex'}}>
            <div className="routeEditor">
              <Box>
                <BoxHeader heading="Edit Route">
                  <div className="box-tools">
                    <Button
                      bsStyle="primary"
                      disabled={waypoints.length <= 2 || routeLoading}
                      onClick={this.requestRoute}
                    >
                      Route
                    </Button>
                    {' '}
                    <Button
                      bsStyle="success"
                      disabled={waypoints.length <= 2 || routeLoading}
                      onClick={this.requestOptimized}
                    >
                      Optimize
                    </Button>
                    {' '}
                    <a
                      className="btn btn-default"
                      href={this.getGoogleUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Show on Google
                    </a>
                  </div>
                </BoxHeader>
                <BoxBody
                  loading={loading}
                  error={loadError || routeError}
                  errorBottom
                  style={{height: '100%', overflowY: 'scroll'}}
                >
                  {waypoints &&
                    <RouteOrder waypoints={waypoints} driver={driver} />
                  }
                </BoxBody>
              </Box>
            </div>
            <div style={{flexGrow: 1}} className="googleMap">
              {settings && driver && waypoints && <RouteMap driver={driver} />}
            </div>
          </div>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverRoute)
