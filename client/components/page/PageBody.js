import React from 'react'

import {ErrorWrapper} from '../error'

const PageBody = ({children, error, errorTop, errorBottom}) => (
  <section className="content">
    <ErrorWrapper
      error={error}
      errorTop={errorTop}
      errorBottom={errorBottom}
    >
      {children}
    </ErrorWrapper>
  </section>
)
export default PageBody
