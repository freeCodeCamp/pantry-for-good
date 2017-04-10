import React from 'react'
import {Row, Col} from 'react-bootstrap'

import Box from '../../../components/Box'
import FieldGroup from '../../../components/FieldGroup'

const heading = `VOLUNTEER RELEASE AND WAIVER OF LIABILITY – READ BEFORE SIGNING
(BY SIGNING THIS AGREEMENT YOU WILL WAIVER CERTAIN LEGAL RIGHTS, INCLUDING THE RIGHT TO SUE)`

const VolunteerWaiver = ({settings, model, onFieldChange, isMinor}) =>
  <Box
    type="primary"
    heading={heading}
  >
    <span>{settings.mission}</span>
    <ol>
      <li>
        {`Policies and Safety Rules. For my safety and that of others, I will comply with ${settings.organization}’s volunteer policies and safety rules and its other directors for all volunteer activities.`}
      </li>
      <li>
        {`Awareness and Assumption of Risk. I understand that my volunteer activities may have inherit risks that may arise from the activities themselves, ${settings.organization}’s operations, my own actions or inactions, or the actions or inactions of ${settings.organization}, its trustees, directors, employees, and agents, other volunteers, and others present. These risks may include, but are not limited to, working around vehicles, lifting objects, and performing repetitive tasks. I assume full responsibility for any and all risks of bodily injury, death or property damage caused by or arising directly or indirectly from my presence or participation at ${settings.organization}’s activities, regardless of the cause.`}
      </li>
      <li>
        {`Waiver and Release of Claims. I waive and release any and all claims against ${settings.organization}, its trustees, directors, officers, officials, employees, volunteers, donors, sponsors, beneficiaries, sponsoring agencies and affiliates (collectively, the “Released Parties”), for any liability, loss, damages, claims, expenses and legal fees resulting from death, or injury to my person or property, caused by or arising directly or indirectly from my presence at ${settings.organization}, or participation in activities on behalf of ${settings.organization}, regardless of the cause even if caused by negligence, whether passive or active. I agree not to sue any of the Released Parties on the basis of these waived and released claims. I understand that ${settings.organization} would not permit me to volunteer without my agreeing to these waivers and releases.`}
      </li>
      <li>
        {`Medical Care Consent and Waiver. I authorize ${settings.organization} to provide to me first aid and, through medical personnel of its choice, medical assistance, transportation, and emergency medical services. This consent does not impose a duty upon ${settings.organization} to provide such assistance, transportation, or services. In addition, I waive and release any claims against the Released Parties arising out of any first aid, treatment, or medical service, including the lack or timing of such, made in connection with my volunteer activities with ${settings.organization}.`}
      </li>
      <li>
        {`Indemnification. I will defend, indemnify, and hold the Released Parties harmless from and against any and all loss, damages, claims, expenses and legal fees that may be suffered by any Released Party resulting directly or indirectly from my volunteer activities for ${settings.organization}, except and only to extent the liability is caused by gross negligence or willful misconduct of the relevant Released Party.`}
      </li>
      <li>
        {`Publicity. I consent to the unrestricted use of my image, voice, name and/or story in any format including video, print, or electronic (collectively the “Materials”) that the Released Parties or others may create in connection with my participation in activities at or for ${settings.organization}. ${settings.organization} may make Materials available at its discretion to third parties, including photos or streamed or other videos, on ${settings.organization}’s websites and internal displays, in publications, or through and other media, including social networking websites. I waive any right to inspect or approve the finished product and acknowledge that I am not entitled to any compensation for creation or use of the finished product.`}
      </li>
      <li>
        {`Confidentiality. As a volunteer, I may have access to sensitive or confidential information. This information includes, but is not limited to, identity, address, contact information, and financial information. At all times during and after my participation, I agree to hold in confidence and not disclose or use any such confidential information except as required in my volunteer activities or as expressly authorized in writing by ${settings.organization}’s executives.`}
      </li>
      <li>
        {`Volunteer Not an Employee. I understand that (i) I am not an employee of ${settings.organization}, (ii) that I will not be paid for my participation, and (iii) I am not covered by or eligible for any insurance, health care, worker’s compensation, or other benefits. I may choose at any time not to participate in an activity, or to stop my participation entirely, with ${settings.organization}.`}
      </li>
      <p>
        <strong>I HAVE READ THIS WAIVER AND RELEASE OF LIABILITY, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE ASSUMED SIGNIFICANT RISKS AND GIVEN UP SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT.</strong>
      </p>
      <Row>
        <Col xs={4} md={6} lg={4}>
          <FieldGroup
            id="disclaimerAgree"
            label="I agree"
            type="checkbox"
            value={model.disclaimerAgree}
            onChange={onFieldChange('disclaimerAgree')}
            required
          />
        </Col>
        <Col xs={8} md={6} lg={4}>
          <FieldGroup
            id="disclaimerSign"
            label="Sign here"
            disabled={!model.disclaimerAgree}
            value={model.disclaimerSign}
            onChange={onFieldChange('disclaimerSign')}
            placeholder="Sign here"
            required
          />
        </Col>
        <div className="clearfix"></div>
        {isMinor &&
          <div>
            <Col md={6} lg={4}>
              <FieldGroup
                id="disclaimerSignGuardian"
                label="Parent/Guardian Signature"
                value={model.disclaimerSignGuardian}
                onChange={onFieldChange('disclaimerSignGuardian')}
              />
            </Col>
            <Col md={6} lg={4}>
              <FieldGroup
                id="disclaimerGuardianEmail"
                label="Parent/Guardian Email"
                type="email"
                value={model.disclaimerGuardianEmail}
                onChange={onFieldChange('disclaimerGuardianEmail')}
              />
            </Col>
          </div>
        }
      </Row>
    </ol>
  </Box>

export default VolunteerWaiver
