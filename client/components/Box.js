import React from 'react'

const Box = ({children, heading, type}) => {
  let boxClass = 'box'
  if (type) boxClass += ` box-${type}`

  return (
    <div className={boxClass}>
      <div className="box-header">
        <h3 className="box-title">
          {heading}
        </h3>
      </div>
      <div className="box-body">
        {children}
      </div>
    </div>
  )
}

export default Box
