import React from 'react'

class Category extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showEdit: false, editedName: this.props.category }
  }

  onChange = e => {
    this.setState({ editedName: e.target.value })
  }

  onClickShowEdit = () => {
    this.setState({ showEdit: true })
  }

  onEnterSubmitEdit = e => {
    if (e.key === "Enter") {
      this.setState({ showEdit: false })
      this.props.onItemEdit(this.props.id, this.state.editedName)
    }

    if (e.key === "Escape") {
      this.setState({ showEdit: false })
      this.setState({ editedName: this.props.category})
    }
  }

  onClickSubmitEdit = () => {
    this.setState({ showEdit: false })
    this.props.onItemEdit(this.props.id, this.state.editedName)
  }

  onClickRemove = () => {
    this.props.onItemRemove(this.props.id)
  }

  moveCursor = e => {
    let storedValue = e.target.value
    e.target.value = ''
    e.target.value = storedValue
  }

  render = () => {
    if (this.state.showEdit) {
      return (
        <tr>
          <td>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={this.state.editedName}
                onChange={this.onChange}
                onKeyDown={this.onEnterSubmitEdit}
                onFocus={this.moveCursor}
                required
                autoFocus
              />
              <span className="input-group-btn">
                <button
                  className="btn btn-success btn-flat"
                  onClick={this.onClickSubmitEdit}
                  disabled={this.state.editedName.trim() === ""}
                >
                  <i className="fa fa-check" />
                </button>
              </span>
            </div>
          </td>
        </tr>
      )
    } else {
      return (
        <tr>
          <td>
            <span>{this.props.category}</span>
            <span
              className="tools"
              style={{ float: "right", marginRight: "8px" }}
            >
              <i
                className="fa fa-edit text-blue"
                onClick={this.onClickShowEdit}
                style={{ marginRight: "8px" }}
              />
              <i
                className="fa fa-trash-o text-red"
                onClick={this.onClickRemove}
              />
            </span>
          </td>
        </tr>
      )
    }
  }
}

export default Category
