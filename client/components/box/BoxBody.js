import React from 'react'
import P from 'prop-types'

import {ErrorWrapper} from '../error'
import LoadingWrapper from '../LoadingWrapper'

const BoxBody = ({
  children,
  loading,
  error,
  errorTop,
  errorBottom
}) =>
  <div className="box-body">
    <ErrorWrapper
      error={error}
      errorTop={errorTop}
      errorBottom={errorBottom}
    >
      <LoadingWrapper loading={loading}>
        {children}
      </LoadingWrapper>
    </ErrorWrapper>
  </div>

BoxBody.propTypes = {
  children: P.node,
  loading: P.bool,
  error: P.oneOfType([
    P.string,
    P.shape({message: P.string})
  ]),
  errorTop: P.bool,
  errorBottom: P.bool
}

export default BoxBody
