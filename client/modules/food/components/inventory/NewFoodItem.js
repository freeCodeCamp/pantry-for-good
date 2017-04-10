import React from 'react'

class NewFoodItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameInputValue: "",
      quantityInputValue: 1,
      categoryInputValue: "",
      validated: false
    }
  }

  onChangeName = e => {
    this.setState({ nameInputValue: e.target.value }, this.validate)
  }

  onChangeCategory = e => {
    this.setState({ categoryInputValue: e.target.value }, this.validate)
  }

  onChangeQuantity = e => {
    this.setState({ quantityInputValue: e.target.value }, this.validate)
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.saveFoodItem(this.state.categoryInputValue, {name: this.state.nameInputValue, quantity: this.state.quantityInputValue})
    this.setState({
      nameInputValue: "",
      quantityInputValue: 1,
      validated: false
    })
  }

  validate = () => {
    this.setState({validated: 
            this.state.nameInputValue.trim() &&
            this.state.categoryInputValue &&
            this.state.quantityInputValue &&
            this.state.quantityInputValue >= 0})
  }

  render = () => (
        <tr>
            <td>
                <input className="form-control"
                    type="text"
                    value={this.state.nameInputValue}
                    onChange={e => this.onChangeName(e)}
                    placeholder="Food Item" />
            </td>
            <td>
                {this.props.createSelectBox(this.onChangeCategory)}
            </td>
            <td>
                <input className="form-control"
                    type="number" min="0"
                    value={this.state.quantityInputValue}
                    onChange={e => this.onChangeQuantity(e)}
                    placeholder="Quantity" />
            </td>
            <td>
                <button className="btn btn-success btn-flat" 
                        disabled={!this.state.validated}
                        onClick={e => this.onSubmit(e)}>
                    <i className="fa fa-plus"></i> Add Item
                </button>
            </td>
        </tr>
    )
}

export default NewFoodItem
