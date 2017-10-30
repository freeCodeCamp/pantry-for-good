import React from 'react'
import PropTypes from 'prop-types'

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
  children: PropTypes.node,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({message: PropTypes.string})
  ]),
  errorTop: PropTypes.bool,
  errorBottom: PropTypes.bool
}

export default ErrorWrapper
