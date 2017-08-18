import Customer from '../models/customer'
import Volunteer from '../models/volunteer'
import Donor from '../models/donor'

/**
* Update Volunteer fields of address
*/
export async function updateVolunteer(reqbodyfields, user_id) {
  //Updating address of the volunteer role if exists
  const volunteer = await Volunteer.findById(user_id)
  if(volunteer != undefined && volunteer != null && volunteer != {}){
    let oldAdrFields = volunteer.fields
    for(let j = 0; j < oldAdrFields.length; j++){
      for(let k = 0; k < reqbodyfields.length; k++){
        if(oldAdrFields[j].meta == reqbodyfields[k].meta) oldAdrFields[j].value = reqbodyfields[k].value
      }
    }
    await Volunteer.findByIdAndUpdate(user_id, {fields: oldAdrFields})
  }
}

/**
* Update Customer fields of address
*/
export async function updateCustomer(reqbodyfields, user_id) {
  //Updating address of the customer role if exists
  const customer = await Customer.findById(user_id)
  if(customer != undefined && customer != null && customer != {}){
    let oldAdrFields = customer.fields
    for(let j = 0; j < oldAdrFields.length; j++){
      for(let k = 0; k < reqbodyfields.length; k++){
        if(oldAdrFields[j].meta == reqbodyfields[k].meta) oldAdrFields[j].value = reqbodyfields[k].value
      }
    }
    await Customer.findByIdAndUpdate(user_id, {fields: oldAdrFields})
  }
}

/**
* Update Donor fields of address
*/
export async function updateDonor(reqbodyfields, user_id) {
  //Updating address of the customer role if exists
  const donor = await Donor.findById(user_id)
  if(donor != undefined && donor != null && donor != {}){
    let oldAdrFields = donor.fields
    for(let j = 0; j < oldAdrFields.length; j++){
      for(let k = 0; k < reqbodyfields.length; k++){
        if(oldAdrFields[j].meta == reqbodyfields[k].meta) oldAdrFields[j].value = reqbodyfields[k].value
      }
    }
    await Donor.findByIdAndUpdate(user_id, {fields: oldAdrFields})
  }
}
