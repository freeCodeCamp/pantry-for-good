import React from 'react'
import {connect} from 'react-redux'
import {noop} from 'lodash'

import selectors from '../../../../store/selectors'
import {toggleCustomer, selectCluster} from '../../reducers/assignment'
import Map from '../Map'
import Markers from './Markers'
import DrawSelection from './DrawSelection'

const mapStateToProps = state => ({
  settings: selectors.settings.getSettings(state),
  route: selectors.delivery.route.getRoute(state)
})

const mapDispatchToProps = dispatch => ({
  toggleCustomer: id => () => dispatch(toggleCustomer(id)),
  selectCluster: (cluster, customers, selectedCustomerIds) =>
    dispatch(selectCluster(cluster, customers, selectedCustomerIds))
})

const loadingElement = (
  <div className="overlay"><i className="fa fa-refresh fa-spin"></i></div>
)

const SelectCustomersMap = ({
  settings,
  route
}) =>
  settings ?
    <div>
      <Map
        googleMapURL={getGoogleMapURL(settings)}
        loadingElement={loadingElement}
        containerElement={<div className="googleMap" />}
        mapElement={<div style={{ height: '100%' }} />}
        onMapLoad={noop}
        onMapClick={noop}
        onMarkerRightClick={noop}
        route={route}
        defaultCenter={settings.location}
      >
        <Markers />
        {!route && <DrawSelection />}
      </Map>
    </div> :
    null

export default connect(mapStateToProps, mapDispatchToProps)(SelectCustomersMap)

function getGoogleMapURL(settings) {
  const {gmapsApiKey, gmapsClientId} = settings
  const baseUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing&'
  return gmapsClientId ?
    `${baseUrl}id=${gmapsClientId}` :
    `${baseUrl}key=${gmapsApiKey}`
}

