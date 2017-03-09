import React, { Component } from 'react'
import { connect } from 'react-redux';

class FoodCategories extends Component {

    onItemEdit(id, value) {
        console.log('onItemEdit ', id, ' ', value)
    }

    onItemRemove(id) {
        console.log('onItemRemove ', id)
    }

    render() {
        let rows 
        if (this.props.foodCategories && this.props.foodCategories.length > 0) {
            rows = this.props.foodCategory.ids.map((id) => {
                return (
                    <ListItem key={id} id={id} category={this.props.entities[id].category} onItemEdit={this.onItemEdit} onItemRemove={this.onItemRemove} />
                )
            })
        } else {
            rows = (<tr><td className="text-center">No food categories yet.</td></tr>)
        }

        return (
            <div className="box">
                <div className="box-header">
                    <h3 className="box-title">Categories</h3>
                </div>

                <div className="box-body table-responsive no-padding">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr><th>Name</th></tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>

                <div className="box-footer">
                    <form name="categoryForm" data-ng-submit="$ctrl.create()">
                        <div className="input-group">
                            <input type="text"
                                className="form-control"
                                data-ng-model="$ctrl.food.category"
                                placeholder="Add category"
                                required />
                            <span className="input-group-btn">
                                <button className="btn btn-success btn-flat" type="submit" data-ng-disabled="categoryForm.$invalid">
                                    <i className="fa fa-plus"></i>
                                </button>
                            </span>
                        </div>
                    </form>

                    <div data-ng-show="$ctrl.error" className="text-center text-danger">
                        <strong data-ng-bind="$ctrl.error"></strong>
                    </div>
                </div>

                {this.props.foodCategory.fetching &&
                    <div className="overlay">
                        <i className="fa fa-refresh fa-spin"></i>
                    </div>
                }

            </div>

        )
    }
}

const mapStateToProps = (state) => ({
    entities: state.entities.foodCategories, 
    foodCategory: state.foodCategory
})

export default connect(mapStateToProps)(FoodCategories)

class ListItem extends Component {
    constructor(props) {
        super(props)
        this.state = { showEdit: false, value: this.props.category }
    }

    render() {
        if (this.state.showEdit) {
            return (
                <tr>
                    <td>
                        <div className="input-group">
                            <input type="text" className="form-control" value={this.state.value} onChange={(e) => this.onChange(e)} required />
                            <span className="input-group-btn">
                                <button className="btn btn-success btn-flat" onClick={() => this.onClickSubmitEdit()} data-ng-disabled="categoryForm.$invalid">
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
                            <i className="fa fa-edit text-blue" onClick={() => this.onClickShowEdit()}></i>
                            <i className="fa fa-trash-o text-red" onClick={() => this.onClickRemove()}></i>
                        </div>
                    </td>
                </tr>
            )
        }
    }

    onChange(e) {
        this.setState({value: e.target.value})
    }

    onClickShowEdit() {
        this.setState({ showEdit: true })
    }

    onClickSubmitEdit(e) {
        this.setState({ showEdit: false })
        this.props.onItemEdit(this.props.id, this.state.value)
    }

    onClickRemove() {
        this.props.onItemRemove(this.props.id)
    }
}