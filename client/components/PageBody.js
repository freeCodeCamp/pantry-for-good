import React from 'react'

import Error from './Error'

const PageBody = ({children, error, errorTop, errorBottom}) => {
  // if error position not specified, render top and bottom
  const errorPos = errorTop || errorBottom
  return (
    <section className="content">
      {errorTop || !errorPos &&
        <Error error={error} />
      }
      {children}
      {errorBottom || !errorPos &&
        <Error error={error} />
      }
    </section>
  )
}

export default PageBody
