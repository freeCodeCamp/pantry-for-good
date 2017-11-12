import React from 'react'
import {connect} from 'react-redux'
import DrawingManager from 'react-google-maps/lib/drawing/DrawingManager'

import selectors from '../../../../../store/selectors'
import {selectCustomers} from '../../../reducers/assignment'

const mapStateToProps = state => ({
  customers: selectors.delivery.assignment.getFilteredCustomers(state),
})

const mapDispatchToProps = dispatch => ({
  selectCustomers: customers => dispatch(selectCustomers(customers))
})

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  selectShape: type => shape => {
    dispatchProps.selectCustomers(onlyInBounds(shape, type, stateProps.customers))
    shape.setVisible(false)
  }
})

const shapeOptions = {
  fillColor: '#000',
  fillOpacity: 0.2,
  strokeWeight: 2,
  strokeOpacity: 0.4,
  clickable: false,
  editable: false,
  zIndex: 1,
}

const DrawSelection = ({
  selectShape
}) =>
  <DrawingManager
    defaultDrawingMode={null}
    defaultOptions={{
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.RECTANGLE
        ],
      },
      circleOptions: shapeOptions,
      rectangleOptions: shapeOptions
    }}
    onCircleComplete={selectShape('circle')}
    onRectangleComplete={selectShape('rectangle')}
  />

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DrawSelection)

function onlyInBounds(shape, shapeType, customers) {
  return customers.filter(inBounds(shape, shapeType))
}

function inBounds(shape, shapeType) {
  return test => {
    if (shapeType === 'circle') {
      return google.maps.geometry.spherical.computeDistanceBetween(
        shape.getCenter(), locationToClass(test)) < shape.getRadius()
    } else {
      return shape.getBounds().contains(locationToClass(test))
    }
  }
}

/**
 * convert object location to LatLng class for geometry api
 *
 * @param {Object} o
 */
function locationToClass(o) {
  return new google.maps.LatLng(o.location)
}
