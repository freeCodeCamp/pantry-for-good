import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ListGroup} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {
  editSection,
  deleteSection,
  addSection,
  updateSection,
  selectSection
} from '../reducers/editor/index'

import SectionView from './SectionView'
import SectionEdit from './SectionEdit'

const mapStateToProps = state => ({
  sectionIds: selectors.qEditor.getSectionIds(state),
  getSection: selectors.qEditor.getSectionById(state),
  editing: selectors.qEditor.getEditingSection(state),
  selected: selectors.qEditor.getSelectedSection(state)
})

const mapDispatchToProps = dispatch => ({
  editSection: id => dispatch(editSection(id)),
  selectSection: id => dispatch(selectSection(id)),
  deleteSection: id => dispatch(deleteSection(id)),
  addSection: section => dispatch(addSection(section)),
  updateSection: section => dispatch(updateSection(section))
})

class SectionForm extends Component {
  handleEdit = id => () => this.props.editSection(id)

  handleDelete = id => () => this.props.deleteSection(id)

  handleCancel = section => () => {
    this.props.editSection()
    if (!section.name.trim().length)
      this.props.deleteSection(section._id)
  }

  handleSelect = section => () => {
    if (this.props.editing !== section._id)
      this.props.editSection()
    this.props.selectSection(section)
  }

  handleUpdate = section => () => {
    this.props.updateSection(section)
    this.props.editSection()
  }

  handleKeyUp = (oldSection, newSection, valid) => ev => {
    if (ev.keyCode === 13 && valid)
      this.handleUpdate(newSection)()
    if (ev.keyCode === 27)
      this.handleCancel(oldSection)()
  }

  render() {
    const {
      sectionIds,
      getSection,
      editing,
      selected,
      addSection
    } = this.props

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '10px 0'
          }}
        >
          <h4>Sections</h4>
          <button
            className="btn btn-success"
            onClick={addSection}
            disabled={editing}
          >
            Add Section
          </button>
        </div>
        <ListGroup>
          {sectionIds.map((id, idx) => id === editing ?
            <SectionEdit
              key={idx}
              id={id}
              onCancel={this.handleCancel}
              onSave={this.handleUpdate}
              onKeyUp={this.handleKeyUp}
            /> :
            <SectionView
              key={idx}
              idx={idx}
              section={getSection(id)}
              onEdit={this.handleEdit(id)}
              onDelete={this.handleDelete(id)}
              onSelect={this.handleSelect(id)}
              selected={selected}
            />
          )}
        </ListGroup>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionForm)

