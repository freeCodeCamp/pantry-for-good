import React from 'react'

import {pageTypes} from '../../../../common/constants'
import './quill-toolbar.css'

const QuillBodyToolbar = ({placeholders, type}) =>
  <div id={`${type}-toolbar`}>
    <span className="ql-formats">
      <select className="ql-header" defaultValue="">
        <option value="1"></option>
        <option value="2"></option>
        <option value="3"></option>
        <option value=""></option>
      </select>
      <select className="ql-font" defaultValue=""></select>
      <select className="ql-size" defaultValue="">
        <option value="small"></option>
        <option value=""></option>
        <option value="large"></option>
        <option value="huge"></option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <button className="ql-strike"></button>
      <button className="ql-blockquote"></button>
    </span>
    <span className="ql-formats">
      <select className="ql-color" defaultValue=""></select>
      <select className="ql-background" defaultValue=""></select>
    </span>
    <span className="ql-formats">
      <select className="ql-align" defaultValue=""></select>
      <button className="ql-indent" value="+1"></button>
      <button className="ql-indent" value="-1"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-link"></button>
      <button className="ql-image"></button>
      {type === pageTypes.PAGE && <button className="ql-video"></button>}
    </span>
    <span className="ql-formats">
      <select className="ql-placeholder">
        {placeholders.filter(placeholder => !placeholder.required)
          .map((placeholder, i) =>
            <option key={i} value={placeholder.id}>
              {placeholder.label}
            </option>
          )}
      </select>
    </span>
  </div>

export default QuillBodyToolbar
