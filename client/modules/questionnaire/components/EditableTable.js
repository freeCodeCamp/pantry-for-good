import React, {Component} from 'react'
import {connect} from 'react-redux'
import {onlyUpdateForKeys, compose} from 'recompose'
import {reset} from 'redux-form'
import {Table} from 'react-bootstrap'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import FieldGroup from '../../../components/form/FieldGroup'
import EditableRow from './EditableRow'
import TableRow from './TableRow'

const mapDispatchToProps = dispatch => ({
  reset: form => dispatch(reset(form))
})

class EditableTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      updating: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const {name, reset, fetching} = nextProps
    const {saving, updating} = this.state

    // reset header form after save
    if (saving && !fetching) {
      this.setState({saving: false})
      reset(`${name}HeaderForm`)
    }

    // hide edit form after update
    if (updating && !fetching) {
      this.setState({updating: false})
      this.props.onEdit()()
    }
  }

  // hack into onSave to see if it's a save or update
  onSave = model => {
    this.setState({
      saving: !model._id,
      updating: !!model._id
    })
    this.props.onSave(model)
  }

  render() {
    const {
      heading,
      name,
      searchable,
      rows,
      columns,
      actions,
      fetching,
      error,
      editing,
      onEdit,
      onDelete
    } = this.props

    return (
      <Box>
        <BoxHeader heading={heading}>
          {searchable &&
            <FieldGroup
              name="search"
              type="search"
              placeholder="Search"
              icon="search"
              formGroupClass="box-tools"
            />
          }
        </BoxHeader>
        <BoxBody loading={fetching} error={error}>
          <Table responsive striped>
            <thead>
              <EditableRow
                form={`${name}HeaderForm`}
                columns={columns}
                actions={actions.header}
                onSubmit={this.onSave}
              />
              <tr>
                {columns.map((column, i) =>
                  <th
                    key={i}
                    style={{width: `${i === 0 ? 100 / columns.length + '%' : 'auto'}`}}
                  >
                    {column.label}
                  </th>
                )}
                <th style={{width: '190px'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows && rows.map((row, i) =>
                editing === row._id ?
                  <EditableRow
                    key={i}
                    form={`${name}RowForm`}
                    initialValues={row}
                    columns={columns}
                    actions={actions.editRow}
                    onSubmit={this.onSave}
                    onEdit={onEdit}
                  /> :
                  <TableRow
                    key={i}
                    model={row}
                    columns={columns}
                    actions={actions.tableRow}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
              )}
              {!rows.length &&
                <tr>
                  <td className="text-center" colSpan="4">{`No ${name} yet.`}</td>
                </tr>
              }
            </tbody>
          </Table>
        </BoxBody>
      </Box>
    )
  }
}

const updateKeys = [
  'error',
  'fetching',
  'editing',
  // causes everything to always update
  // memoizing questionnaire and field selectors doesn't help
  // 'rows',

]

export default compose(
  onlyUpdateForKeys(updateKeys),
  connect(null, mapDispatchToProps)
)(EditableTable)
