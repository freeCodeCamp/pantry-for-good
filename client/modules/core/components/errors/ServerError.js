import React from 'react'

const ServerErrorPage = () =>
  <section className="content" style={{backgroundColor: 'white'}}>
    <div className="error-page">
      <h2 className="headline text-red">500&#125;</h2>
      <div className="error-content">
        <h3>
          <i className="fa fa-warning text-red" />
          Oops! Something went wrong.
        </h3>
        <p>
          We will work on fixing that right away.
        </p>
      </div>
    </div>
  </section>

export default ServerErrorPage
