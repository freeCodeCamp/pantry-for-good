import React from 'react'

import {ErrorWrapper} from '../error'
import LoadingWrapper from '../LoadingWrapper'

const BoxBody = ({
  children,
  loading,
  error,
  errorTop,
  errorBottom
}) =>
  <ErrorWrapper
    className="box-body"
    error={error}
    errorTop={errorTop}
    errorBottom={errorBottom}
  >
    <LoadingWrapper loading={loading}>
      {children}
    </LoadingWrapper>
  </ErrorWrapper>

export default BoxBody
