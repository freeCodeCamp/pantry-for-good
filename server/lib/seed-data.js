import {utc} from 'moment'

import config from '../config/env/all'

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

export const settingsFields = {
  organization: 'Foodbank Template',
  mission: 'Foodbank Template is a volunteer run organization based in (location) with the mission of helping families who are in need. We provide weekly non-perishable and freshly baked goods, to ensure that every family has delicious meals. The organization was founded in (year) in memory of (founder), who was very kind and sensitive to the needs of others.',
  instructions: '<p><strong>Please carefully read the following information:</strong>Boxes will be delivered by our volunteers every <strong>Wednesday</strong> evening between <strong>8:00PM and 11:00PM</strong>. Boxes will be left at your doorstep. Volunteers may knock on your door and quickly leave to keep anonymity. During holidays, or other special times, including severe weather conditions, time and day of delivery may change without notice.</p><p>We ask that you <strong>leave the empty box outside your door</strong> the following week, so it can be picked up by the volunteers and reused.</p><p>Volunteers do their best to check food items for expiry dates, however mistakes do occur. <strong>Please use your own judgment and discretion before consuming any food or contact the manufacturer directly if you have any concerns</strong>. If you find an item that is expired, you may throw it away. <strong>If there are items that you don\'t use, please leave them in the box, and we will make a note so that you will not receive them again</strong>.</p><p>If there is a change in your financial situation and you no longer need our assistance, if you will be away  for a certain period, if you have a change in contact information, or any other change, please inform us promptly.</p>',
  thanks: '<p>In the past year, over (amount) pounds of food was distributed on a weekly basis by our team of dedicated volunteers. Your assistance helps us respond to the ever-growing demand of our community. <strong>Thank you for taking the opportunity to help turn lives around.</strong></p><p>With your help, we are able to support the less fortunate families in our community, by providing them with nutritious food and energy to grow, learn, work, and give them hope for a better and brighter future.</p>',
  url: 'www.example.com',
  foodBankAddress: '6 Rhyd-Y-Penau Road, Cardiff, Wales, CF23 6PT',
  clientIntakeNumber: '07123 456 789',
  supportNumber: '07234 567 891',
  location: [51.520185, -3.178096],
  gmapsApiKey: config.gmapsApiKey
}

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
