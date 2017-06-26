import React from 'react'
import {connect} from 'react-redux'
import {branch, compose, renderNothing , withHandlers, withState} from 'recompose'
import {Button} from 'react-bootstrap'

import selectors from '../../../store/selectors'

const mapStateToProps = (state, ownProps) => ({
  linkableFields: selectors.questionnaire.getLinkableFields(state)(
    ownProps.questionnaire.identifier)
})

const enhance = compose(
  branch(({questionnaire}) => !questionnaire, renderNothing),
  connect(mapStateToProps),
  withState('selectedField', 'handleUpdateSelected', ''),
  withHandlers({
    handleUpdateSelected: ({handleUpdateSelected}) => ev =>
      handleUpdateSelected(ev.target.value),
    handleLink: ({handleLink, handleUpdateSelected, selectedField}) => () => {
      handleLink(selectedField)
      handleUpdateSelected('')
    }
  })
)

const LinkField = ({
  linkableFields,
  selectedField,
  handleUpdateSelected,
  handleLink
}) =>
  <div style={{display: 'flex', flexShrink: 1}}>
    <select
      className="form-control"
      onChange={handleUpdateSelected}
      value={selectedField}
      style={{marginRight: '10px'}}
    >
      <option value="" label="Link Field" />
      {linkableFields.map(q =>
        <optgroup label={q.name} key={q.identifier}>
          {q.fields.map(field =>
            <option label={field.label} value={field._id} key={field._id} />
          )}
        </optgroup>
      )}
    </select>
    <Button
      bsStyle="primary"
      onClick={handleLink}
      disabled={!selectedField}
    >
      Link Field
    </Button>
  </div>

export default enhance(LinkField)
