import React from 'react'

import {Page, PageBody} from '../../../components/page'
import Packages from './packing/Packages'
import PackingList from './packing/PackingList'

const Packing = () => (
  <Page>
    <PageBody>
      <PackingList />
      <Packages />
    </PageBody>
  </Page>
)

export default Packing
