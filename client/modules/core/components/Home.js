import React from 'react'

import FoodbankLogo from '../../../components/FoodbankLogo'
import ContentPage from '../../../components/ContentPage'

const Home = ({match}) =>
  <section className="content-header">
    <div className="row text-center">
      <FoodbankLogo />
      <ContentPage url={match.url} />
    </div>
  </section>

export default Home
