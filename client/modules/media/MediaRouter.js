import React from 'react'
import {Route} from 'react-router-dom'

import Media from './components/Media'
import SwitchWithNotFound from '../../components/router/SwitchWithNotFound'

const MediaRouter = ({match}) =>
  <SwitchWithNotFound>
      <Route path={match.url} exact component={Media} />
  </SwitchWithNotFound>

export default MediaRouter
