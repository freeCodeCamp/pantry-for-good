import {utc} from 'moment'
import faker from 'faker'

import config from '../config'

const addRandomDate = item =>
  ({...item, startDate: utc(faker.date.past(2)).startOf('isoWeek')})
export const foodFields = [{
  category: 'Cheese',
  items: [
    {name: 'Cheddar', quantity: 20, frequency: 1},
    {name: 'Mozarella', quantity: 35, frequency: 2},
    {name: 'Brie', quantity: 30, frequency: 4},
    {name: 'Emmental', quantity: 20, frequency: 1},
    {name: 'Monterey Jack', quantity: 20, frequency: 1},
    {name: 'Stilton', quantity: 20, frequency: 1},
    {name: 'Camembert', quantity: 20, frequency: 1},
    {name: 'Port Salut', quantity: 20, frequency: 1},
    {name: 'Gorgonzola', quantity: 20, frequency: 1},
  ].map(addRandomDate)
}, {
  category: 'Pasta, rice etc',
  items: [
    {name: 'Penne pasta', quantity: 50, frequency: 1},
    {name: 'Basmati rice', quantity: 40, frequency: 1},
    {name: 'Fusilli pasta', quantity: 45, frequency: 2},
    {name: 'Couscous', quantity: 40, frequency: 1},
    {name: 'Spagetti', quantity: 50, frequency: 1},
    {name: 'Jasmine rice', quantity: 50, frequency: 1},
  ].map(addRandomDate)
}, {
  category: 'Meat',
  items: [
    {name: 'Beef mince', quantity: 25, frequency: 2},
    {name: 'Chicken breast', quantity: 15, frequency: 2},
    {name: 'Pork chop', quantity: 20, frequency: 2},
    {name: 'T-Bone steak', quantity: 25, frequency: 2},
    {name: 'Chicken thighs', quantity: 20, frequency: 2},
    {name: 'Bacon', quantity: 20, frequency: 2},
    {name: 'Salami', quantity: 15, frequency: 2},
    {name: 'Pepperoni', quantity: 15, frequency: 2},
  ].map(addRandomDate)
}, {
  category: 'Vegetables',
  items: [
    {name: 'Carrots', quantity: 30, frequency: 1},
    {name: 'Onions', quantity: 25, frequency: 2},
    {name: 'Squash', quantity: 25, frequency: 4},
    {name: 'Leek', quantity: 30, frequency: 1},
    {name: 'Potatoes', quantity: 25, frequency: 2},
    {name: 'Turnips', quantity: 25, frequency: 4},
    {name: 'Cauliflower', quantity: 30, frequency: 1},
    {name: 'Broccoli', quantity: 25, frequency: 2},
    {name: 'Peas', quantity: 25, frequency: 4}
  ].map(addRandomDate)
}, {
  category: 'Milk',
  items: [
    {name: 'Whole milk', quantity: 15, frequency: 1},
    {name: 'Semi-skimmed milk', quantity: 15, frequency: 1}
  ].map(addRandomDate)
}, {
  category: 'Snacks',
  items: [
    {name: 'Snickers', quantity: 20, frequency: 3},
    {name: 'Mars bar', quantity: 20, frequency: 3},
    {name: 'Potato chips', quantity: 20, frequency: 3},
  ].map(addRandomDate)
}]

export const getSettingsFields = addressGenerator => {
  const {lat, lng, street, city, zip} = addressGenerator.getOne()

  return {
    organization: 'Foodbank Template',
    url: 'www.example.com',
    foodBankAddress: `${street} ${city} ${zip}`,
    clientIntakeNumber: '07123 456 789',
    supportNumber: '07234 567 891',
    location: {lat, lng},
    gmapsApiKey: config.gmapsApiKey
  }
}

export const pages = [{
  identifier: 'home',
  title: 'Home',
  body: '<p>Foodbank Template is a volunteer run organization based in (location) with the mission of helping families who are in need. We provide weekly non-perishable and freshly baked goods, to ensure that every family has delicious meals.</p><p>The organization was founded in (year) in memory of (founder), who was very kind and sensitive to the needs of others.</p><p><a href="/customers">Customer Information (internal link)</a></p><p><a href="http://google.com">Google (external link)</a></p>'
}, {
  identifier: 'customers',
  title: 'Customers',
  body: '<p><strong>Please carefully read the following information:</strong></p><ul><li>Boxes will be delivered by our volunteers every <strong>Wednesday</strong> evening between <strong>8:00PM and 11:00PM</strong>.</li><li>Boxes will be left at your doorstep. Volunteers may knock on your door and quickly leave to keep anonymity. During holidays, or other special times, including severe weather conditions, time and day of delivery may change without notice.</li><li>We ask that you <strong>leave the empty box outside your door</strong> the following week, so it can be picked up by the volunteers and reused.</li><li>Volunteers do their best to check food items for expiry dates, however mistakes do occur. <strong>Please use your own judgment and discretion before consuming any food or contact the manufacturer directly if you have any concerns</strong>. If you find an item that is expired, you may throw it away. <strong>If there are items that you don\'t use, please leave them in the box, and we will make a note so that you will not receive them again</strong>.</li><li>If there is a change in your financial situation and you no longer need our assistance, if you will be away  for a certain period, if you have a change in contact information, or any other change, please inform us promptly.</li></ul>'
}, {
  identifier: 'donors',
  title: 'Donors',
  body: ''
}, {
  identifier: 'volunteers',
  title: 'Volunteers',
  body: '<p>In the past year, over (amount) pounds of food was distributed on a weekly basis by our team of dedicated volunteers. Your assistance helps us respond to the ever-growing demand of our community. <strong>Thank you for taking the opportunity to help turn lives around.</strong></p><p>With your help, we are able to support the less fortunate families in our community, by providing them with nutritious food and energy to grow, learn, work, and give them hope for a better and brighter future.</p>'
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
