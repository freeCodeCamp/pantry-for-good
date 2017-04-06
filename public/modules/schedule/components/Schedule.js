import React, {Component} from 'react'
import {connect} from 'react-redux'
import {stateGo} from 'redux-ui-router';
import {Table} from 'react-bootstrap'

import {selectors} from '../../../store';
import {loadFoods} from '../../../store/food-category';
import {saveFoodItem} from '../../../store/food-item';

import Page from '../../common/components/Page'
import ItemRow from './ItemRow'

const mapStateToProps = state => ({
	foodItems: selectors.getAllFoodItems(state),
  foodCategories: selectors.getAllFoods(state),
  loadingFoods: selectors.loadingFoods(state),
  loadFoodsError: selectors.loadFoodsError(state)
});

const mapDispatchToProps = dispatch => ({
  loadFoods: () => dispatch(loadFoods()),
  saveFood: (categoryId, foodItem) => dispatch(saveFoodItem(categoryId, foodItem)),
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});

class Schedule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemModel: null,
      showEdit: null,
      error: null
    }
  }

  componentWillMount() {
    this.props.loadFoods()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loadingFoods && this.props.loadFoods) {
      this.setState({error: nextProps.loadFoodsError})
    }
  }

  saveFood = () => {
    const {itemModel} = this.state
    if (!itemModel) return

    const category = this.props.foodCategories.find(cat =>
      cat.items.find(item => item._id === itemModel._id)
    )

    this.props.saveFood(category._id, itemModel)
  }

  handleShowEdit = item => () =>
    this.setState({
      itemModel: {...item},
      showEdit: item && item._id
    })

  handleFieldChange = field => ev =>
    this.setState({
      itemModel: {
        ...this.state.itemModel,
        [field]: ev.target.value
      }
    })

  render() {
    const {itemModel, error} = this.state
    const {foodItems, loadingFoods} = this.props
    return (
      <Page heading="Food Schedule">
        <div className="row">
          <div className="col-xs-12">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Items</h3>
                <div className="box-tools">
                  <div className="form-group has-feedback">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search"
                    />
                    <span className="glyphicon glyphicon-search form-control-feedback"></span>
                  </div>
                </div>
              </div>
              <div className="box-body table-responsive no-padding top-buffer">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Start date</th>
                      <th>Frequency (in weeks)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodItems && foodItems.map((item, i) =>
                      <ItemRow
                        key={i}
                        item={item}
                        model={itemModel}
                        showEdit={this.state.showEdit === item._id}
                        handleSave={this.saveFood}
                        handleShowEdit={this.handleShowEdit}
                        handleFieldChange={this.handleFieldChange}
                      />
                    )}
                    {!foodItems &&
                      <tr>
                        <td className="text-center" colSpan="4">No food items yet.</td>
                      </tr>
                    }
                  </tbody>
                </Table>
              </div>
              {loadingFoods &&
                <div className="overlay">
                  <i className="fa fa-refresh fa-spin"></i>
                </div>
              }
            </div>
          </div>
        </div>
        {error &&
          <div className="text-danger">
            <strong>{loadFoodsError}</strong>
          </div>
        }
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule)