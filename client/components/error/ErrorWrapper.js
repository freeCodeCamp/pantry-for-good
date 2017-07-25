import React from 'react'
import P from 'prop-types'

import Error from './Error'

const ErrorWrapper = ({
  children,
  error,
  errorTop,
  errorBottom,
}) => {
  // if error position not specified, render top and bottom
  const errorPos = errorTop || errorBottom

  return (
    <div>
      {(errorTop || !errorPos) &&
        <Error error={error} />
      }
      {children}
      {(errorBottom || !errorPos) &&
        <Error error={error} />
      }
    </div>
  )
}

ErrorWrapper.propTypes = {
  children: P.node,
  error: P.oneOfType([
    P.string,
    P.shape({message: P.string})
  ]),
  errorTop: P.bool,
  errorBottom: P.bool
}

export default ErrorWrapper
