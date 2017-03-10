import React from 'react'

class NewCategory extends React.Component {
    constructor(props) {
        super(props)
        this.state = {inputFieldValue: ""}
    }

    onChange = (e) => {
        this.setState({inputFieldValue: e.target.value})
    }

    onClick = () => {
        this.props.createCategory(this.state.inputFieldValue)
    }

    render = () => (
        <div className="input-group">
            <input type="text"
                className="form-control"
                placeholder="Add category"
                value={this.state.value}
                onChange={(e) => this.onChange(e)} />
            <span className="input-group-btn">
                <button className="btn btn-success btn-flat"
                    data-ng-disabled="categoryForm.$invalid"
                    onClick={this.onClick}>
                    <i className="fa fa-plus"></i>
                </button>
            </span>
        </div>
    )
}

export default NewCategory
