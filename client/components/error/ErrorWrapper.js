import React from 'react'

import Error from './Error'

const ErrorWrapper = ({
  children,
  error,
  errorTop,
  errorBottom,
  ...props
}) => {
  // if error position not specified, render top and bottom
  const errorPos = errorTop || errorBottom

  return (
    <div {...props}>
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

export default ErrorWrapper
