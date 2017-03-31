import React from 'react'

const Household = ({
  numberOfDependants,
  dependants,
  setDependantList,
  handleFieldChange
}) =>
  <div className="box box-solid box-primary">
    <div className="box-header">
      <h3 className="box-title">SECTION E - DEPENDANTS AND PEOPLE IN HOUSEHOLD</h3>
    </div>
    <div className="box-body">
      <div className="row">
        <div className="col-md-10 col-lg-8">
          <div className="form-group">
            <label className="col-md-10">How many people in your household will be needing assistance?</label>
            <div className="col-sm-2">
              <input
                type="number"
                id="numberOfDependants"
                value={numberOfDependants}
                className="form-control"
                min="1"
                max="20"
                onChange={setDependantList}
              />
            </div>
          </div>
        </div>
        <div className="clearfix"></div>
        {dependants.map((dependant, i) =>
          <div key={i}>
            <div className="col-sm-6 col-lg-4">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={dependant.name}
                  className="form-control"
                  onChange={handleFieldChange(`household[${i}].name`)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="form-group">
                <label>Relationship to Applicant</label>
                <input
                  type="text"
                  value={dependant.relationship}
                  className="form-control"
                  onChange={handleFieldChange(`household[${i}].relationship`)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-lg-4">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={dependant.dateOfBirth}
                  className="form-control"
                  onChange={handleFieldChange(`household[${i}].dateOfBirth`)}
                />
              </div>
            </div>
          </div>
        )}
        <div className="clearfix"></div>
      </div>
    </div>
  </div>

export default Household
