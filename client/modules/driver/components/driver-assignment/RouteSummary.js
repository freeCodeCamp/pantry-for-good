import React from 'react'


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

  ///////RONALD
  var fixDistance = ` ${Math.round(distance / 100) / 10} km, `
  if(settings.distanceUnit == 'km') fixDistance = ` ${Math.round(distance / 100) / 10} km, `
  if(settings.distanceUnit == 'mi') fixDistance = ` ${Math.round(distance * 0.00062137)} mi, `
  ///////RONALD

  return (
    <div>
      {`${route.routes[0].legs.length} stops,`}
      {fixDistance}
      {` approx ${hourString} ${minuteString}`}
    </div>
  )
}

export default RouteSummary
