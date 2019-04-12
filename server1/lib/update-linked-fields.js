import Customer from '../models/customer'
import Volunteer from '../models/volunteer'
import Donor from '../models/donor'
import {clientRoles} from '../../common/constants'

/**
* Update fields of address
*/
async function updatedModel(Model, reqBodyFields, userId) {
  const model = await Model.findById(userId)
  if (model != undefined && model != null && model != {}) {
    let modelFields = model.fields
    for (let j = 0; j < modelFields.length; j++) {
      for (let k = 0; k < reqBodyFields.length; k++) {
        if (modelFields[j].meta == reqBodyFields[k].meta)
          modelFields[j].value = reqBodyFields[k].value
      }
    }
    await Model.findByIdAndUpdate(userId, {fields: modelFields})
  }
}

/**
* Update All fields of address
*/
export function updateFields(clientRole, reqBodyFields, userId) {
  //Updating address of the client type role if exists
  if (clientRole == clientRoles.CUSTOMER) {
    updatedModel(Volunteer, reqBodyFields, userId)
    updatedModel(Donor, reqBodyFields, userId)
  } else if (clientRole == clientRoles.DONOR) {
    updatedModel(Volunteer, reqBodyFields, userId)
    updatedModel(Customer, reqBodyFields, userId)
  } else if (clientRole == clientRoles.VOLUNTEER) {
    updatedModel(Donor, reqBodyFields, userId)
    updatedModel(Customer, reqBodyFields, userId)
  }
}
