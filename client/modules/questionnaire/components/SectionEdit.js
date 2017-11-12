import React, {Component} from 'react'
import {connect} from 'react-redux'

import selectors from '../../../store/selectors'
import {FieldGroup} from '../../../components/form'

const mapStateToProps = state => ({
  getSection: selectors.qEditor.getSectionById(state)
})

class SectionEdit extends Component {
  constructor(props) {
    super(props)
    const section = props.getSection(props.id)
    this.state = {
      name: section.name,
      touched: false
    }
  }
  handleCancel = () => this.setState({name: this.props.sectionName})
  handleChange = e => {
    this.setState({
      name: e.target.value,
      touched: true
    })
  }
  handleBlur = () => this.setState({touched: true})
  render() {
    const {touched, name} = this.state
    const {onSave, onCancel, onKeyUp} = this.props
    const section = this.props.getSection(this.props.id)
    const updatedSection = {...section, name}
    const valid = isValid(touched, name)

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        className="list-group-item active"
      >
        <FieldGroup
          type="text"
          value={name}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onKeyUp={onKeyUp(section, updatedSection, valid !== 'error')}
          valid={valid}
          placeholder="Section Name"
          autoFocus
          formGroupClass="form-group-no-margin"
          style={{lineHeight: '1rem'}}
        />
        <div style={{marginLeft: '5px', flexShrink: 0}}>
          <i
            className="fa fa-save"
            style={{marginRight: '5px'}}
            onClick={valid !== 'error' && onSave(updatedSection)}
          />
          {' '}
          <i
            className="fa fa-times"
            onClick={onCancel(section)}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(SectionEdit)

function isValid(touched, name) {
  if (touched && !name.trim().length)
    return 'error'
}
