import React from 'react'

class FoodItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showEdit: false,
      nameInputValue: this.props.foodItem.name,
      categorySelectValue: this.props.foodItem.category,
      quantityInputValue: this.props.foodItem.quantity,
      validated: false
    }
  }

  validate = () => {
    this.setState({validated:
            this.state.nameInputValue.trim() &&
            this.state.categorySelectValue &&
            this.state.quantityInputValue &&
            this.state.quantityInputValue >= 0})
  }

  onClickShowEdit = () => {
    this.setState({
      showEdit: !this.state.showEdit,
      nameInputValue: this.props.foodItem.name,
      categorySelectValue: this.props.foodItem.categoryId,
      quantityInputValue: this.props.foodItem.quantity
    })
  }

  onChangeName = e => {
    this.setState({ nameInputValue: e.target.value }, this.validate)
  }

  onChangeCategory = e => {
    this.setState({ categorySelectValue: e.target.value }, this.validate)
  }

  onChangeQuantity = e => {
    this.setState({ quantityInputValue: e.target.value }, this.validate)
  }

  onClickDelete = () => {
    this.props.deleteItem(this.props.foodItem.categoryId, this.props.foodItem._id)
  }

  onClickSave = () => {
    this.props.saveItem(this.props.foodItem.categoryId, {...this.props.foodItem, name: this.state.nameInputValue, categoryId: this.state.categorySelectValue, quantity: this.state.quantityInputValue})
    this.setState({showEdit: false})
  }

  render = () => {
    const category = _.find(this.props.foodCategories, { _id: this.props.foodItem.categoryId })
    if (!this.state.showEdit) {
      return (
                <tr>
                    <td className="form-control">{this.props.foodItem.name}</td>
                    <td>{category.category}</td>
                    <td>{this.props.foodItem.quantity}</td>
                    <td>
                        <button onClick={this.onClickShowEdit} className="btn btn-primary btn-flat btn-xs"><i className="fa fa-pencil"></i> Edit</button>
                        <button onClick={this.onClickDelete} className="btn btn-danger btn-flat btn-xs"><i className="fa fa-trash"></i> Delete</button>
                    </td>
                </tr>
      )
    } else {
      return (
                <tr>
                    <td>
                        <input className="form-control" type="text"
                            value={this.state.nameInputValue}
                            onChange={e => this.onChangeName(e)} />
                    </td>
                    <td>
                        {this.props.createSelectBox(this.onChangeCategory, this.state.categorySelectValue)}
                    </td>
                    <td>
                        <input className="form-control" type="number" min="0"
                            value={this.state.quantityInputValue}
                            onChange={e => this.onChangeQuantity(e)} />
                    </td>
                    <td>
                        <button onClick={this.onClickShowEdit} className="btn btn-primary btn-flat btn-xs">
                            <i className="fa fa-times"></i>Cancel
                        </button>
                        <button onClick={this.onClickSave} disabled={!this.state.validated} className="btn btn-success btn-flat btn-xs">
                            <i className="fa fa-download"></i>Save
                        </button>
                    </td>
                </tr>
      )
    }
  }


}

export default FoodItem
