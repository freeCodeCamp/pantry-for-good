import {schema} from 'normalizr';

export const customer = new schema.Entity('customers', {}, {idAttribute: '_id'});
export const donation = new schema.Entity('donations', {}, {idAttribute: '_id'});
export const donor = new schema.Entity('donors', {}, {idAttribute: '_id'});
export const field = new schema.Entity('fields', {}, {idAttribute: '_id'});
export const food = new schema.Entity('foods', {}, {idAttribute: '_id'});
export const questionnaire = new schema.Entity('questionnaires',{},  {idAttribute: '_id'});
export const section = new schema.Entity('sections', {}, {idAttribute: '_id'});
export const user = new schema.Entity('users', {}, {idAttribute: '_id'});
export const volunteer = new schema.Entity('volunteers', {}, {idAttribute: '_id'});

export const arrayOfDonations = new schema.Array(donation);
export const arrayOfCustomers = new schema.Array(customer);
export const arrayOfFields = new schema.Array(field);
export const arrayOfFoods = new schema.Array(food);
export const arrayOfQuestionnaires = new schema.Array(questionnaire);
export const arrayOfSections = new schema.Array(section);
export const arrayOfUsers = new schema.Array(user);
export const arrayOfVolunteers = new schema.Array(volunteer);

customer.define({
  foodPreferences: arrayOfFoods,
  assignedTo: volunteer,
  _id: user
});

donor.define({
  donations: arrayOfDonations,
  _id: user
});

field.define({section});

section.define({questionnaire});

volunteer.define({
  customers: arrayOfCustomers,
  _id: user
});
