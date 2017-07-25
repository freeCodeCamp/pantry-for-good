import React from 'react'
import P from 'prop-types'

import {ErrorWrapper} from '../error'
import LoadingWrapper from '../LoadingWrapper'
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
  <div className="login-box">
    {showLogo &&
      <div className="login-logo">
        <FoodbankLogo />
      </div>
    }
    <div className="login-box-body box">
      <LoadingWrapper loading={loading}>
        {heading && <p className="login-box-msg">{heading}</p>}
        <form name={formName} autoComplete={autoComplete || 'off'}>
          <ErrorWrapper error={error} errorBottom>
            {children}
          </ErrorWrapper>
        </form>
      </LoadingWrapper>
    </div>
  </div>

LoginBox.propTypes = {
  children: P.node,
  loading: P.bool,
  error: P.oneOfType([
    P.string,
    P.shape({message: P.string})
  ]),
  heading: P.string,
  formName: P.string.isRequired,
  showLogo: P.bool,
  autoComplete: P.bool
}

export default LoginBox
