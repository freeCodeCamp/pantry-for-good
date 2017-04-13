import React from 'react'

import LoadingWrapper from '../LoadingWrapper'
import {ErrorWrapper} from '../error'
import FoodbankLogo from '../FoodbankLogo'

const LoginBox = ({
  children,
  loading,
  error,
  heading,
  formName,
  showLogo,
  autoComplete,
}) =>
  <LoadingWrapper
    loading={loading}
    className="login-box"
  >
    {showLogo &&
      <div className="login-logo">
        <FoodbankLogo />
      </div>
    }
    <div className="login-box-body">
      {heading && <p className="login-box-msg">{heading}</p>}
      <form name={formName} autoComplete={autoComplete || 'off'}>
        <ErrorWrapper error={error} errorBottom>
          {children}
        </ErrorWrapper>
      </form>
    </div>
  </LoadingWrapper>

export default LoginBox
