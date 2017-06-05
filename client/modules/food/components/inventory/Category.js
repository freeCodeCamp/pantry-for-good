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

  onClickSubmitEdit = () => {
    this.setState({ showEdit: false })
    this.props.onItemEdit(this.props.id, this.state.editedName)
  }

  onClickRemove = () => {
    this.props.onItemRemove(this.props.id)
  }

  render = () => {
    if (this.state.showEdit) {
      return (
        <tr>
          <td>
            <div className="input-group">
              <input type="text" className="form-control" value={this.state.editedName} onChange={this.onChange} required />
              <span className="input-group-btn">
                <button className="btn btn-success btn-flat" onClick={this.onClickSubmitEdit} disabled={this.state.editedName.trim() === ""}>
                  <i className="fa fa-check"></i>
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
            <div className="tools">
              <i className="fa fa-edit text-blue" onClick={this.onClickShowEdit}></i>
              <i className="fa fa-trash-o text-red" onClick={this.onClickRemove}></i>
            </div>
          </td>
        </tr>
      )
    }
  }

}

export default Category
