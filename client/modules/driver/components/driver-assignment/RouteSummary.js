import React from 'react'
import PropTypes from 'prop-types'

const RouteSummary = ({route, settings}) => {
  const {distance, duration} = route.routes[0].legs.reduce((acc, x) => ({
    distance: acc.distance + x.distance.value,
    duration: acc.duration + x.duration.value
  }), {distance: 0, duration: 0})
  const minutes = Math.floor((duration / 60) % 60)
  const hours = Math.floor(duration / 60 / 60)

  let hourString = '', minuteString
  if (hours) hourString = hours === 1 ? `${hours} hour` : `${hours} hours`
  if (minutes) minuteString = `${minutes} minutes`

  let distanceString = ` ${Math.round(distance * 0.00062137)} mi, `
  if(settings.distanceUnit == 'km') distanceString = ` ${Math.round(distance / 100) / 10} km, `
  if(settings.distanceUnit == 'mi') distanceString = ` ${Math.round(distance * 0.00062137)} mi, `

  return (
    <div>
      {`${route.routes[0].legs.length} stops,`}
      {distanceString}
      {` approx ${hourString} ${minuteString}`}
    </div>
  )
}

RouteSummary.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.array
  }).isRequired,
  settings: PropTypes.shape({
    distanceUnit: PropTypes.oneOf(['km', 'mi'])
  }).isRequired
}

export default RouteSummary
