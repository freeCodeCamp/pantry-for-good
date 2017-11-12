import React from 'react'

class NewCategory extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputFieldValue: "",
      categoryExists: false,
      validInput: false
    }
  }

  onChange = e => {
    this.setState({inputFieldValue: e.target.value}, this.validate)
  }

  onClick = () => {
    this.props.createCategory(this.state.inputFieldValue)
    this.setState({inputFieldValue: "", validInput: false, categoryExists: false})
  }

  validate = () => {
    const trimmedInput = this.state.inputFieldValue.trim()
    const categoryExists = this.props.doesCategoryExist(trimmedInput)
    const validInput = (trimmedInput !== "") && !categoryExists
    this.setState({validInput, categoryExists})
  }

  render = () => (
    <div>
      <div className="input-group">
        <input type="text"
          className="form-control"
          placeholder="Add category"
          value={this.state.inputFieldValue}
          onChange={this.onChange} />
        <span className="input-group-btn">
          <button className="btn btn-success btn-flat" disabled={!this.state.validInput}
            onClick={this.onClick}>
            <i className="fa fa-plus"></i>
          </button>
        </span>
      </div>
      {this.state.categoryExists &&
        <div className="text-center text-danger">
          <strong>That category already exists</strong>
        </div>
      }
    </div>
  )
}

export default NewCategory
