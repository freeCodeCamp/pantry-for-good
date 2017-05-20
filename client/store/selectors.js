import {createSelectors as createCustomerSelectors} from '../modules/customer/reducer'
import {createSelectors as createDonationSelectors} from '../modules/donor/reducers/donation'
import {createSelectors as createDonorSelectors} from '../modules/donor/reducers/donor'
import {createSelectors as createDeliverySelectors} from '../modules/driver/reducers'
import {createSelectors as createFoodSelectors} from '../modules/food/reducers'
import {createSelectors as createMediaSelectors} from '../modules/settings/reducers/media'
import {createSelectors as createQuestionnaireSelectors} from '../modules/questionnaire/reducers/api'
import {createSelectors as createQEditorSelectors} from '../modules/questionnaire/reducers/editor'
import {createSelectors as createSettingsSelectors} from '../modules/settings/reducers/settings'
import {createSelectors as createUserSelectors} from '../modules/users/reducer'
import {createSelectors as createVolunteerSelectors} from '../modules/volunteer/reducer'

const customerSelectors = createCustomerSelectors('customer')
const deliverySelectors = createDeliverySelectors('delivery', customerSelectors)

export default {
  customer: customerSelectors,
  delivery: deliverySelectors,
  donation: createDonationSelectors('donation'),
  donor: createDonorSelectors('donor'),
  food: createFoodSelectors('food'),
  media: createMediaSelectors('media'),
  questionnaire: createQuestionnaireSelectors('questionnaire'),
  qEditor: createQEditorSelectors('questionnaireEditor'),
  settings: createSettingsSelectors('settings'),
  user: createUserSelectors('auth'),
  volunteer: createVolunteerSelectors('volunteer')
}
