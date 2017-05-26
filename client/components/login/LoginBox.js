import React from 'react'

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
  <div className="login-box">
    {showLogo &&
      <div className="login-logo">
        <FoodbankLogo />
      </div>
    }
    <div className="login-box-body box">
      {heading && <p className="login-box-msg">{heading}</p>}
      <form name={formName} autoComplete={autoComplete || 'off'}>
        <ErrorWrapper error={error} errorBottom>
          {children}
        </ErrorWrapper>
      </form>
      {loading &&
        <div className="overlay">
          <i className="fa fa-refresh fa-spin"></i>
        </div>
      }
    </div>
  </div>

export default LoginBox
