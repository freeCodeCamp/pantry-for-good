import React from 'react'
import P from 'prop-types'

import LoadingWrapper from '../LoadingWrapper'

const Page = ({loading, children}) =>
  <LoadingWrapper loading={loading}>
    {children}
  </LoadingWrapper>

Page.propTypes = {
  loading: P.bool,
  children: P.node
}

export default Page
