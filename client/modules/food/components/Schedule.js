import React, {Component} from 'react'
import {connect} from 'react-redux'
import {utc} from 'moment'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import selectors from '../../../store/selectors'
import {loadFoods} from '../reducers/category'
import {saveFoodItem} from '../reducers/item'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import {Page, PageBody} from '../../../components/page'

const mapStateToProps = state => ({
  foodItems: selectors.food.item.getAll(state),
  foodCategories: selectors.food.category.getAll(state),
  getFoodCategory: selectors.food.category.getOne(state),
  loading: selectors.food.category.loading(state),
  saving: selectors.food.item.saving(state),
  error: selectors.food.category.loadError(state) || selectors.food.item.saveError(state)
})

const mapDispatchToProps = dispatch => ({
  loadFoods: () => dispatch(loadFoods()),
  saveFood: foodItem => dispatch(saveFoodItem(foodItem.categoryId, {
    ...foodItem,
    startDate: utc(foodItem.startDate)
  }))
})

class Schedule extends Component {
  componentWillMount() {
    this.props.loadFoods()
  }

  formatData = () => this.props.foodItems ?
    this.props.foodItems.map(f => ({
      ...f,
      startDate: utc(f.startDate).format('YYYY-[W]ww')
    })) :
    []


  getCategoryName = id => {
    const category = this.props.getFoodCategory(id)
    return category && category.category
  }

  render() {
    const {loading, saving, error} = this.props

    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader heading="Schedule Items" />
            <BoxBody loading={loading || saving} error={error}>
              <BootstrapTable
                data={this.formatData()}
                keyField="_id"
                options={{
                  defaultSortName: "name",
                  defaultSortOrder: 'desc',
                  noDataText: loading ? '' : 'No items found'
                }}
                cellEdit={{
                  mode: 'click',
                  blurToSave: true,
                  afterSaveCell: this.props.saveFood
                }}
                hover
                striped
                pagination
                search
              >
                <TableHeaderColumn
                  dataField="name"
                  dataSort
                  editable={false}
                >
                  Item
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="categoryId"
                  dataFormat={this.getCategoryName}
                  dataSort
                  editable={false}
                >
                  Category
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="startDate"
                  dataSort
                  editable={{type: 'week'}}
                >
                  Start Date
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="frequency"
                  dataSort
                  editable={{type: 'number'}}
                >
                  Frequency
                </TableHeaderColumn>
              </BootstrapTable>
            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule)
