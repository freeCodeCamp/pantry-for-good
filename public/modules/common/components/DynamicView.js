import React from 'react'

const DynamicView = ({dynForm, sectionNames}) =>
  <div className="clearfix">
    {dynForm && dynForm.map((section, i) =>
        <div key={i} className="box box-solid box-primary">
          <div className="box-header">
            <h3 className="box-title">SECTION {sectionNames[i].toUpperCase()}</h3>
          </div>
          <div className="box-body">
            <table className="table-striped table-bordered table-hover table">
              <tbody>
                {section.map((row, i) =>
                  <tr key={i} className={row.header ? 'table-header' : ''}>
                  {row.map((cell, i) =>
                    <td key={i}>
                      {cell}
                    </td>
                  )}
                </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    )}
  </div>

export default DynamicView
