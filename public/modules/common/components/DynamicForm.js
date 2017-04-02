import React from 'react'

const DynamicForm = ({
  sectionNames,
  dynForm,
  dynType,
  foodList,
  handleFieldChange,
  isChecked,
  selectAllFoods,
  allFoodsSelected
}) =>
  <div className="clearfix">
    {dynForm.map((section, i) =>
      <div key={i} className="box box-solid box-primary">
        <div className="box-header">
          <h3 className="box-title">SECTION {sectionNames[i].toUpperCase()}</h3>
        </div>
        <div className="box-body">
          {section.map((row, i) =>
            <div key={i}>
              {row.tableHeaders ?
                <table className="table table-condensed table-hover">
                  <thead>
                    <tr className="info">
                      {row.tableHeaders.map((header, i) =>
                        <th key={i}>{header}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {row.table.map((tableRow, i) =>
                      <tr key={i}>
                        <td>{tableRow.name}</td>
                        {Object.keys(tableRow).filter(cell => cell !== 'name')
                          .map((cellName, j) =>
                            <td key={j}>
                              <input
                                type="number"
                                min="0"
                                value={tableRow[cellName]}
                                onChange={handleFieldChange(`${row.tableName}[${i}]${cellName}`)}
                                className="form-control"
                              />
                            </td>
                          )
                        }
                      </tr>
                    )}
                  </tbody>
                </table> :

                <div className="row">
                  {row.map((cell, i) => {
                    if (cell.status === 'invalid' || cell.span > 0) {
                      return (
                        <div key={i} className={`col-xs-${3*cell.span || 3}`}>
                          {cell.status !== 'invalid' &&
                            <div key={i} className="form-group">
                              <label>{cell.label}</label>
                              {cell.type === 'Text' &&
                                <input
                                  className="form-control"
                                  type="text"
                                  value={dynType[cell.name] || ''}
                                  onChange={handleFieldChange(cell.name)}
                                  placeholder={cell.label}
                                />
                              }
                              {cell.type === 'Textarea' &&
                                <textarea
                                  className="form-control"
                                  value={dynType[cell.name] || ''}
                                  onChange={handleFieldChange(cell.name)}
                                  placeholder={cell.label}
                                />
                              }
                              {cell.type === 'Date' &&
                                <input
                                  className="form-control"
                                  value={dynType[cell.name] || ''}
                                  onChange={handleFieldChange(cell.name)}
                                  type="date"
                                />
                              }
                              {cell.type === 'Radio Buttons' &&
                                cell.choices.split(',').map((choice, i) =>
                                  <label key={i} className="radio-inline">
                                    <input
                                      name={cell.name}
                                      type="radio"
                                      checked={dynType[cell.name] === choice.trim()}
                                      onChange={handleFieldChange(cell.name)}
                                      value={choice.trim()}
                                    />
                                    {choice.trim()}
                                  </label>
                                )}
                              {cell.type === 'Checkboxes' &&
                                cell.choices.split(',').map((choice, i) =>
                                  <label key={i} className="checkbox-inline">
                                    <input
                                      name={cell.name}
                                      type="checkbox"
                                      value={choice.trim()}
                                      checked={isChecked(cell.name, choice.trim())}
                                      onChange={handleFieldChange(cell.name)}
                                    />
                                    {choice.trim()}&nbsp;&nbsp;
                                  </label>
                                )}
                              {cell.type === 'Lookup' &&
                                <div>
                                  <label className="checkbox-inline">
                                    <input
                                      type="checkbox"
                                      name="selectAllFoods"
                                      checked={allFoodsSelected()}
                                      onChange={selectAllFoods}
                                    />
                                    Select All
                                  </label>
                                  {foodList.map((food, i) =>
                                    <label key={i} className="checkbox-inline">
                                      <input
                                        type="checkbox"
                                        name="selectedFood"
                                        value={food.name}
                                        checked={isChecked('foodPreferences', food)}
                                        onChange={handleFieldChange('foodPreferences', food)}
                                      />
                                      {food.name}
                                    </label>
                                  )}
                                </div>
                              }
                            </div>
                          }
                        </div>
                      )
                    } else {
                      return null
                    }
                  })}
                </div>
              }
            </div>
          )}
        </div>
      </div>
    )}
  </div>

export default DynamicForm
