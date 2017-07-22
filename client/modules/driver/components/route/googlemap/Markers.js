import React from 'react'
import {connect} from 'react-redux'
import {Marker} from 'react-google-maps'
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer'

import selectors from '../../../../../store/selectors'

import customerIcon from '../../../images/gm-marker-blue.png'
import driverIcon from '../../../images/car-green2.png'
import foodbankIcon from '../../../images/home2.png'
import unselectedClusterIcon from '../../../images/m1-cyan.png'

const mapStateToProps = (state, ownProps) => ({
  settings: selectors.settings.getSettings(state),
  waypoints: selectors.delivery.route.getWaypoints(state),
  driver: selectors.volunteer.getOne(ownProps.driverId)
})

const clusterStyles = [
  {url: unselectedClusterIcon, height: 52, width: 53}
]

const Markers = ({
  settings,
  waypoints,
  driver
}) =>
  <div>
    <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={30}
      zoomOnClick={true}
      calculator={calculator}
      styles={clusterStyles}
    >
      {waypoints && waypoints.map(waypoint =>
        <Marker
          key={waypoint._id}
          icon={customerIcon}
          position={waypoint}
          address={waypoint.address}
        />
      )}
    </MarkerClusterer>
    {driver &&
      <Marker
        key={driver._id}
        icon={driverIcon}
        position={driver.location}
        title={driver.fullName}
      />
    }
    <Marker
      icon={foodbankIcon}
      position={settings.location}
      title={settings.organization}
    />
  </div>

export default connect(mapStateToProps)(Markers)

function calculator(markers) {
  return {
    text: markers.length,
    index: 1
  }
}
