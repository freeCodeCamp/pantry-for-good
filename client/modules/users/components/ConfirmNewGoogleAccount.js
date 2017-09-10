import React from 'react'
import {Link} from 'react-router-dom'

import {LoginBox} from '../../../components/login'

const ConfirmNewGoogleAccount = () =>
  <section className="content text-center">
    <LoginBox showLogo>
      <h4>You do not have an account yet</h4>
      <p>Would you like to create one associated with your google account?</p>
      <div>
        <a href="/api/auth/google?action=signup" className="btn btn-primary btn-flat">Yes</a>
        {'\u00a0\u00a0\u00a0\u00a0'}
        <Link to="/" className="btn btn-primary btn-flat">No</Link>
      </div>
    </LoginBox>
  </section>

export default ConfirmNewGoogleAccount
