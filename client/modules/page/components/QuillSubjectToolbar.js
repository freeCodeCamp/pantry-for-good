import React from 'react'

import './quill-toolbar.css'

const QuillSubjectToolbar = ({placeholders}) =>
  <div id="subject-toolbar">
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

export default QuillSubjectToolbar
