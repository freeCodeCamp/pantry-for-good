import React from 'react'

const ErrorPage = ({msg, description, color, status}) =>
  <section className="content">
    <div className="error-page">
      <h2 className={`headline text-${color}`}>{status}}</h2>
      <div className="error-content">
        <h3>
          <i className={`fa fa-warning text-${color}`}></i>
          {msg}
        </h3>
        <p>
          {description} Meanwhile, you may <a href="/#!/">return to the dashboard.</a>
        </p>
      </div>
    </div>
  </section>

export default ErrorPage
