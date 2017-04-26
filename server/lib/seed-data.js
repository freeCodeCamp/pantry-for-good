import {utc} from 'moment'

export const foodFields = [{
  category: 'Cheese',
  items: [
    {name: 'Cheddar', quantity: 20, startDate: utc(utc('2016-03-03').format('YYYY-[W]WW')), frequency: 1},
    {name: 'Mozarella', quantity: 35, startDate: utc(utc('2016-03-10').format('YYYY-[W]WW')), frequency: 2},
    {name: 'Brie', quantity: 30, startDate: utc(utc('2016-10-15').format('YYYY-[W]WW')), frequency: 4}
  ]
}, {
  category: 'Pasta, rice etc',
  items: [
    {name: 'Penne pasta', quantity: 50, startDate: utc(utc('2017-01-05').format('YYYY-[W]WW')), frequency: 1},
    {name: 'Basmati rice', quantity: 40, startDate: utc(utc('2016-09-13').format('YYYY-[W]WW')), frequency: 1},
    {name: 'Fusilli pasta', quantity: 45, startDate: utc(utc('2016-09-13').format('YYYY-[W]WW')), frequency: 2}
  ]
}, {
  category: 'Meat',
  items: [
    {name: 'Beef mince', quantity: 25, startDate: utc(utc('2016-06-03').format('YYYY-[W]WW')), frequency: 2},
    {name: 'Chicken breast', quantity: 15, startDate: utc(utc('2016-05-10').format('YYYY-[W]WW')), frequency: 2},
    {name: 'Pork chop', quantity: 20, startDate: utc(utc('2016-04-10').format('YYYY-[W]WW')), frequency: 2}
  ]
}, {
  category: 'Vegetables',
  items: [
    {name: 'Carrots', quantity: 30, startDate: utc(utc('2016-07-12').format('YYYY-[W]WW')), frequency: 1},
    {name: 'Onions', quantity: 25, startDate: utc(utc('2016-04-12').format('YYYY-[W]WW')), frequency: 2},
    {name: 'Squash', quantity: 25, startDate: utc(utc('2016-03-02').format('YYYY-[W]WW')), frequency: 4}
  ]
}]

export const customerQuestionnaire = {
  name: 'Customer Application',
  identifier: 'qCustomers',
  sections: [{
    name: 'General Info',
    position: 0,
    fields: [
      {type: 'address', position: 0, label: 'Street', required: true},
      {type: 'address', position: 1, label: 'Town/City', required: true},
      {type: 'address', position: 2, label: 'State/Province', required: true},
      {type: 'address', position: 3, label: 'Zip/Post Code', required: true},
      {type: 'text', position: 4, label: 'Telephone Number', required: true},
      {type: 'date', position: 5, label: 'Date of Birth', required: true},
      {type: 'radio', choices: 'Male, Female', position: 6, label: 'Gender', required: true},
      {type: 'radio', choices: 'Rental, Own, Subsidized, Other', position: 7,label: 'Accommodation Type'},
      {type:'radio', choices: 'Phone, Email', position: 8, label: 'Best way to contact'},
      {type: 'textarea', position: 9, label: 'Delivery instructions', required: true},
      {type: 'textarea', position: 10, label: 'Other organizations you are currently receiving assistance from'},
      {type: 'checkbox', choices: 'Foo, Bar', position: 11, label: 'foo'}
    ]
  }, {
    name: 'Employment',
    position: 1,
    fields: [
      {type: 'radio', position: 1, choices: 'Employed, Unemployed, Laid-off, Retired, Disabled, Student', label: 'Current work status'},
      {type: 'text', position: 2, label: 'Hours per week'},
      {type: 'text', position: 3, label: 'Job title'},
    ]
  }, {
    name: 'Food Preferences',
    position: 2,
    fields: [
      {type:'foodPreferences', position: 1, label: 'Please select the foods you are interested in'},
      {type:'textarea',position: 2, label: 'Please list any food allergies or sensitivities'},
      {type: 'textarea', position: 3, label: 'Other food preferences'},
    ]
  }, {
    name: 'Financial Assessment',
    position: 3,
    fields: [
      {label:'Monthly Gross Income', rows: ['Employment Income', 'Employment Insurance Benefits', 'Social Assistance', 'Spousal/Child Support', 'Self Employment', 'Pension Income (eg. Employer Plan)', 'Disability Income', 'Pension Plan', 'Child Tax Benefits', 'Income from Rental Property', 'Severance/Termination Pay', 'Other income not listed above'], columns: ['Self', 'Other'], type: 'table', position: 1},
      {label: 'Monthly Living Expenses', rows: ['Rent, mortgage or room and board', 'Food', 'Utilities (phone, internet, water, heat/hydro)', 'Transportation, parking and other personal supports', 'Dependant Care (eg. day care)', 'Disability Needs', 'Spousal/Child support', 'Loans', 'Leases', 'Insurance', 'Credit card debt', 'Property taxes', 'Other costs not listed above'], columns: ['Household'], type: 'table', position: 2}
    ]
  }, {
    name: 'Household',
    position: 4,
    fields: [
      {type: 'household', position: 0, label: 'Household'}
    ]
  }]
}


export const donorQuestionnaire = {
  name: 'Donor Application',
  identifier: 'qDonors',
  sections: [{
    name: 'General Info',
    position: 0,
    fields: [
      {type: 'text', position: 0, label: 'Street', required:true},
      {type: 'text', position: 1, label: 'Town/City', required:true},
      {type: 'text', position: 2, label: 'State/Province', required:true},
      {type: 'text', position: 3, label: 'Zip/Post Code', required:true},
      {type: 'text', position: 4, label: 'Telephone Number', required:true},
      {type: 'textarea', position: 5,label: 'How did you hear about us?'}
    ]
  }]
}

export const volunteerQuestionnaire = {
  name: 'Volunteer Application',
  identifier: 'qVolunteers',
  sections: [{
    name: 'General Info',
    position: 0,
    fields: [
      {type: 'text', position: 0, label: 'Street', required:true},
      {type: 'text', position: 1, label: 'Town/City', required:true},
      {type: 'text', position: 2, label: 'State/Province', required:true},
      {type: 'text', position: 3, label: 'Zip/Post Code', required:true},
      {type: 'text', position: 4, label: 'Telephone Number', required:true},
      {type: 'date', position: 5, label: 'Date of Birth', required:true},
      {type: 'radio', choices: 'Phone, Email', position: 6, label: 'Best way to contact'},
      {type: 'textarea', position: 7, label: 'How did you hear about us?'},
      {type: 'textarea', position: 8, label: 'Why do you want to volunteer with us?'}
    ]
  }]
}
