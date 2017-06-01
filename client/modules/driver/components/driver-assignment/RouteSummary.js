import React from 'react'

const RouteSummary = ({route}) => {
  const {distance, duration} = route.routes[0].legs.reduce((acc, x) => ({
    distance: acc.distance + x.distance.value,
    duration: acc.duration + x.duration.value
  }), {distance: 0, duration: 0})
  const minutes = Math.floor((duration / 60) % 60)
  const hours = Math.floor(duration / 60 / 60)

  let hourString = '', minuteString
  if (hours) hourString = hours === 1 ? `${hours} hour` : `${hours} hours`
  if (minutes) minuteString = `${minutes} minutes`

  return (
    <div>
      {`${route.routes[0].legs.length} stops,`}
      {` ${Math.round(distance / 100) / 10} km, `}
      {` approx ${hourString} ${minuteString}`}
    </div>
  )
}

export default RouteSummary
