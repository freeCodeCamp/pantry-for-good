import React from 'react'
import {Table} from 'react-bootstrap'

const DynamicView = ({model, dynForm, sectionNames}) =>
  <div className="clearfix">
    {dynForm && dynForm.map((section, i) =>
      <div key={i} className="box box-solid box-primary">
        <div className="box-header">
          <h3 className="box-title">SECTION {sectionNames[i].toUpperCase()}</h3>
        </div>
        <div className="box-body">
          {section.map((row, i) =>
            <div key={i}>
              {row.tableHeaders ?
                <Table responsive>
                  <thead>
                    <tr>
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
                              {tableRow[cellName]}
                            </td>
                          )
                        }
                      </tr>
                    )}
                  </tbody>
                </Table> :
                <Table responsive>
                  <tbody>
                    <tr key={i} className={row.header ? 'table-header' : ''}>
                      {row.map((cell, i) =>
                        <td key={i} className="col-xs-3">
                          <div>
                            <strong>{cell.label}:</strong>
                            <span style={{paddingLeft: "1rem"}} >
                              {model[cell.name]}
                            </span>
                          </div>
                        </td>
                      )}
                    </tr>
                  </tbody>
                </Table>
              }
            </div>
          )}
        </div>
      </div>
    )}
  </div>

export default DynamicView
