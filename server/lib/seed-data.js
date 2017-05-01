import {utc} from 'moment'

export const foodFields = [{
  category: 'Cheese',
  items: [
    {name: 'Cheddar', quantity: 20, startDate: utc('2016-03-03').startOf('isoWeek'), frequency: 1},
    {name: 'Mozarella', quantity: 35, startDate: utc('2016-03-10').startOf('isoWeek'), frequency: 2},
    {name: 'Brie', quantity: 30, startDate: utc('2016-10-15').startOf('isoWeek'), frequency: 4}
  ]
}, {
  category: 'Pasta, rice etc',
  items: [
    {name: 'Penne pasta', quantity: 50, startDate: utc('2017-01-05').startOf('isoWeek'), frequency: 1},
    {name: 'Basmati rice', quantity: 40, startDate: utc('2016-09-13').startOf('isoWeek'), frequency: 1},
    {name: 'Fusilli pasta', quantity: 45, startDate: utc('2016-09-13').startOf('isoWeek'), frequency: 2}
  ]
}, {
  category: 'Meat',
  items: [
    {name: 'Beef mince', quantity: 25, startDate: utc('2016-06-03').startOf('isoWeek'), frequency: 2},
    {name: 'Chicken breast', quantity: 15, startDate: utc('2016-05-10').startOf('isoWeek'), frequency: 2},
    {name: 'Pork chop', quantity: 20, startDate: utc('2016-04-10').startOf('isoWeek'), frequency: 2}
  ]
}, {
  category: 'Vegetables',
  items: [
    {name: 'Carrots', quantity: 30, startDate: utc('2016-07-12').startOf('isoWeek'), frequency: 1},
    {name: 'Onions', quantity: 25, startDate: utc('2016-04-12').startOf('isoWeek'), frequency: 2},
    {name: 'Squash', quantity: 25, startDate: utc('2016-03-02').startOf('isoWeek'), frequency: 4}
  ]
}]

export const customerQuestionnaire = {
  name: 'Customer Application',
  identifier: 'qCustomers',
  sections: [{
    name: 'General Info',
    fields: [
      {type: 'address', label: 'Street', required: true},
      {type: 'address', label: 'Town/City', required: true},
      {type: 'address', label: 'State/Province', required: true},
      {type: 'address', label: 'Zip/Post Code', required: true},
      {type: 'text', label: 'Telephone Number', required: true},
      {type: 'date', label: 'Date of Birth', required: true},
      {type: 'radio', choices: 'Male, Female', label: 'Gender', required: true},
      {type: 'radio', choices: 'Rental, Own, Subsidized, Other', label: 'Accommodation Type'},
      {type:'radio', choices: 'Phone, Email', label: 'Best way to contact'},
      {type: 'textarea', label: 'Delivery instructions', required: true},
      {type: 'textarea', label: 'Other organizations you are currently receiving assistance from'},
      {type: 'checkbox', choices: 'Foo, Bar', label: 'foo'}
    ]
  }, {
    name: 'Employment',
    fields: [
      {type: 'radio', choices: 'Employed, Unemployed, Laid-off, Retired, Disabled, Student', label: 'Current work status'},
      {type: 'text', label: 'Hours per week'},
      {type: 'text', label: 'Job title'},
    ]
  }, {
    name: 'Food Preferences',
    fields: [
      {type:'foodPreferences', label: 'Please select the foods you are interested in'},
      {type:'textarea', label: 'Please list any food allergies or sensitivities'},
      {type: 'textarea', label: 'Other food preferences'},
    ]
  }, {
    name: 'Financial Assessment',
    fields: [
      {label:'Monthly Gross Income', rows: 'Employment Income, Employment Insurance Benefits, Social Assistance, Spousal/Child Support, Self Employment, Pension Income (eg. Employer Plan), Disability Income, Pension Plan, Child Tax Benefits, Income from Rental Property, Severance/Termination Pay, Other income not listed above', columns: 'Self, Other', type: 'table'},
      {label: 'Monthly Living Expenses', rows: 'Rent mortgage or room and board, Food, Utilities, Transportation, Dependant Care (eg. day care), Disability Needs, Spousal/Child support, Loans, Leases, Insurance, Credit card debt, Property taxes, Other costs not listed above', columns: 'Household', type: 'table'}
    ]
  }, {
    name: 'Household',
    fields: [
      {type: 'household', label: 'Household'}
    ]
  }]
}


export const donorQuestionnaire = {
  name: 'Donor Application',
  identifier: 'qDonors',
  sections: [{
    name: 'General Info',
    fields: [
      {type: 'address', label: 'Street', required:true},
      {type: 'address', label: 'Town/City', required:true},
      {type: 'address', label: 'State/Province', required:true},
      {type: 'address', label: 'Zip/Post Code', required:true},
      {type: 'text', label: 'Telephone Number', required:true},
      {type: 'textarea', label: 'How did you hear about us?'}
    ]
  }]
}

export const volunteerQuestionnaire = {
  name: 'Volunteer Application',
  identifier: 'qVolunteers',
  sections: [{
    name: 'General Info',
    fields: [
      {type: 'address', label: 'Street', required:true},
      {type: 'address', label: 'Town/City', required:true},
      {type: 'address', label: 'State/Province', required:true},
      {type: 'address', label: 'Zip/Post Code', required:true},
      {type: 'text', label: 'Telephone Number', required:true},
      {type: 'date', label: 'Date of Birth', required:true},
      {type: 'radio', choices: 'Phone, Email', label: 'Best way to contact'},
      {type: 'textarea', label: 'How did you hear about us?'},
      {type: 'textarea', label: 'Why do you want to volunteer with us?'}
    ]
  }]
}
