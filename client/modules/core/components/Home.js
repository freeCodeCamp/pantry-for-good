import React from 'react'
import PropTypes from 'prop-types'

import FoodbankLogo from '../../../components/FoodbankLogo'
import ContentPage from '../../../components/ContentPage'

const Home = ({match}) =>
  <section className="content-header">
    <div className="row text-center">
      <FoodbankLogo />
      <ContentPage url={match.url} />
    </div>
  </section>

Home.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string
  }).isRequired
}

export default Home
