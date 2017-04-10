module.exports = {
  questionnaires: [
    {"_id": "58274849e6becb2a88ae19ca","name":"Client Questionnaire","description":"Information on clients","identifier":"qClients","logicReq":true},
    {"_id": "58274849e6becb2a88ae1900","name":"Volunteer Questionnaire","description":"Information on volunteers","identifier":"qVolunteers","logicReq":true},
    {"_id": "58274849e6becb2a88ae1901","name":"Donor Questionnaire","description":"Information on donors","identifier":"qDonors","logicReq":true},
    {"_id": "58274849e6becb2a88ae1902","name":"Test Only","identifier":"qTest"}
  ],
  sections: [
    {"_id": "58274849e6becb2a88ae1950","name":"A - General Information","position":1,"questionnaire":"58274849e6becb2a88ae19ca","logicReq":true},
    {"_id": "58274849e6becb2a88ae1951","name":"B - Employment","questionnaire":"58274849e6becb2a88ae19ca","position":2,"logicReq":true},
    {"_id": "58274849e6becb2a88ae1952","name":"C - Food Preferences","questionnaire":"58274849e6becb2a88ae19ca","position":3},
    {"_id": "585d83571f3a2f2304966d14", "name": "D - Financial Assessment", "questionnaire": "58274849e6becb2a88ae19ca", "position": 4},
    {"_id": "58274849e6becb2a88ae1953","name":"A - Donor Information","position":1,"questionnaire":"58274849e6becb2a88ae1901","logicReq":true},
    {"_id": "58274849e6becb2a88ae1954","name":"A - Volunteer Information","position":1,"questionnaire":"58274849e6becb2a88ae1900","logicReq":true},
    {"_id": "58274849e6becb2a88ae1999","name":"Test Section","questionnaire":"58274849e6becb2a88ae1902","position":1}
  ],
  fields: [
    // Client Questionnaire, Section A, General Info
    {"type":"Radio Buttons","name":"language","section":"58274849e6becb2a88ae1950","choices":"English, Other","row":1,"column":1,"span":1,"label":"Preferred language","logicReq":true},
    {"type":"Text","name":"lastName","section":"58274849e6becb2a88ae1950","row":2,"column":1,"choices":[],"span":1,"label":"Last Name","logicReq":true},
    {"type":"Text","name":"firstName","section":"58274849e6becb2a88ae1950","row":2,"column":2,"choices":[],"span":1,"label":"First Name","logicReq":true},
    {"type":"Text","name":"middleName","section":"58274849e6becb2a88ae1950","row":2,"column":3,"choices":[],"span":1,"label":"Middle Initials"},
    {"name":"address","section":"58274849e6becb2a88ae1950","type":"Text","row":2,"column":4,"choices":[],"span":1,"label":"Primary Mailing Address","logicReq":true},
    {"name":"apartmentNumber","section":"58274849e6becb2a88ae1950","type":"Text","row":3,"column":1,"choices":[],"span":1,"label":"Appartment Number"},
    {"type":"Text","name":"city","section":"58274849e6becb2a88ae1950","row":3,"column":3,"choices":[],"span":1,"label":"City","logicReq":true},
    {"type":"Text","name":"buzzNumber","section":"58274849e6becb2a88ae1950","row":3,"column":2,"span":1,"label":"Buzz Number"},
    {"name":"province","section":"58274849e6becb2a88ae1950","type":"Text","row":3,"column":4,"span":1,"label":"Province"},
    {"name":"postalCode","section":"58274849e6becb2a88ae1950","type":"Text","row":4,"column":1,"span":1,"label":"Postal Code","logicReq":true},
    {"name":"telephoneNumber","section":"58274849e6becb2a88ae1950","type":"Text","row":4,"column":2,"span":1,"label":"Telephone Number","logicReq":true},
    {"name":"mobileNumber","section":"58274849e6becb2a88ae1950","type":"Text","row":4,"column":3,"span":1,"label":"Mobile Number"},
    {"name":"email","section":"58274849e6becb2a88ae1950","type":"Text","row":4,"column":4,"span":1,"label":"Email Address","logicReq":true},
    {"name":"dateOfBirth","section":"58274849e6becb2a88ae1950","type":"Date","row":5,"column":1,"span":1,"label":"Date of Birth","logicReq":true},
    {"name":"gender","section":"58274849e6becb2a88ae1950","type":"Radio Buttons","choices":"Male, Female","row":5,"column":2,"span":1,"label":"Gender","logicReq":true},
    {"name":"accommodationType","section":"58274849e6becb2a88ae1950","type":"Radio Buttons","choices":"Rental, Own, Subsidized, Other","row":5,"column":3,"span":1,"label":"Accommodation Type","logicReq":true},
    {"name":"contactPreference","section":"58274849e6becb2a88ae1950","type":"Radio Buttons","choices":"Phone, Email","row":5,"column":4,"span":1,"label":"Best way to contact","logicReq":true},
    {"name":"deliveryInstructions","section":"58274849e6becb2a88ae1950","type":"Textarea","row":6,"column":1,"span":2,"label":"Box delivery instructions"},
    {"name":"assistanceInformation","section":"58274849e6becb2a88ae1950","type":"Textarea","row":6,"column":3,"span":2,"label":"Please name all of the organizations you are currently receiving assistance from"},
    {"name":"generalNotes","section":"58274849e6becb2a88ae1950","type":"Textarea","row":7,"column":1,"span":2,"label":"General Notes"},

    // Client Questionnaire, Section B, Employment
    {"type":"Radio Buttons","name":"empWorkStatus","section":"58274849e6becb2a88ae1951","choices":"Employed, Unemployed, Laid-off, Retired, Disabled, Student","row":1,"column":1,"span":2,"label":"Current work status","logicReq":true},
    {"label":"Hours per week","name":"hoursPerWeek","section":"58274849e6becb2a88ae1951","type":"Text","row":1,"column":3,"span":1,"logicReq":true},
    {"label":"Job title","name":"jobTitle","section":"58274849e6becb2a88ae1951","type":"Text","row":1,"column":4,"span":1,"logicReq":true},

    // Client Questionnaire, Section C, Food Preferences
    {"name":"foodPreferences","section":"58274849e6becb2a88ae1952","type":"Lookup","row":1,"column":1,"span":4,"label":"Please select all food preferences that apply for you","logicReq":true},
    {"name":"dietaryRequest","section":"58274849e6becb2a88ae1952","type":"Textarea","row":2,"column":1,"span":2,"label":"Please list any food allergies or sensitivities"},
    {"name":"foodPreferencesOther","section":"58274849e6becb2a88ae1952","type":"Textarea","row":2,"column":3,"span":2,"label":"Other food preferences"},

    // Client Questionnaire, Section D, Financial Assessment
    {"_id" : "585d83941f3a2f2304966d15", "label" : "ROWS: Rent, mortgage or room and board; Food; Utilities (phone, internet, water, heat/hydro); Transportation, parking and other personal supports; Dependant Care (eg. day care); Disability Needs; Spousal/Child support; Loans; Leases; Insurance; Credit card debt; Property taxes; Other costs not listed above COLUMNS: PART 2 - MONTHLY LIVING EXPENSES; Household", "name" : "financialAssessmentExpenses", "section" : "585d83571f3a2f2304966d14", "type" : "Table", "row" : 2, "column" : 1, "span" : 1},
    {"_id" : "585ff1d292ffca3df9136aa3", "label" : "ROWS: Employment Income; Employment Insurance Benefits; Social Assistance; Spousal/Child Support; Self Employment; Pension Income (eg. Employer Plan); Disability Income; Workplace Safety and Insurance Board (WSIB) Benefits; Pension Plan; Child Tax Benefits; Income from Rental Property; Severance/Termination Pay;Any other source of income not listed above  COLUMNS: PART 1 - MONTHLY GROSS INCOME; Self; Other", "name" : "financialAssessmentIncome", "section" : "585d83571f3a2f2304966d14", "type" : "Table", "row" : 1, "column" : 1, "span" : 1},

    // Donor Questionnaire
    {"type":"Text","name":"lastName","section":"58274849e6becb2a88ae1953","row":1,"column":1,"choices":[],"span":1,"label":"Last Name","logicReq":true},
    {"type":"Text","name":"firstName","section":"58274849e6becb2a88ae1953","row":1,"column":2,"choices":[],"span":1,"label":"First Name","logicReq":true},
    {"type":"Text","name":"middleName","section":"58274849e6becb2a88ae1953","row":1,"column":3,"choices":[],"span":1,"label":"Middle Initials"},
    {"name":"address","section":"58274849e6becb2a88ae1953","type":"Text","row":1,"column":4,"choices":[],"span":1,"label":"Primary Mailing Address","logicReq":true},
    {"name":"apartmentNumber","section":"58274849e6becb2a88ae1953","type":"Text","row":2,"column":1,"choices":[],"span":1,"label":"Appartment Number"},
    {"type":"Text","name":"city","section":"58274849e6becb2a88ae1953","row":2,"column":3,"choices":[],"span":1,"label":"City","logicReq":true},
    {"type":"Text","name":"buzzNumber","section":"58274849e6becb2a88ae1953","row":2,"column":2,"span":1,"label":"Buzz Number"},
    {"name":"province","section":"58274849e6becb2a88ae1953","type":"Text","row":2,"column":4,"span":1,"label":"Province"},
    {"name":"postalCode","section":"58274849e6becb2a88ae1953","type":"Text","row":3,"column":1,"span":1,"label":"Postal Code","logicReq":true},
    {"name":"telephoneNumber","section":"58274849e6becb2a88ae1953","type":"Text","row":3,"column":2,"span":1,"label":"Telephone Number","logicReq":true},
    {"name":"mobileNumber","section":"58274849e6becb2a88ae1953","type":"Text","row":3,"column":3,"span":1,"label":"Mobile Number"},
    {"name":"email","section":"58274849e6becb2a88ae1953","type":"Text","row":3,"column":4,"span":1,"label":"Email Address","logicReq":true},
    {"name":"referredBy","section":"58274849e6becb2a88ae1953","type":"Textarea","row":4,"column":1,"span":2,"label":"How did you hear about us?"},
    // Volunteer Questionnaire
    {"type":"Text","name":"lastName","section":"58274849e6becb2a88ae1954","row":1,"column":1,"choices":[],"span":1,"label":"Last Name","logicReq":true},
    {"type":"Text","name":"firstName","section":"58274849e6becb2a88ae1954","row":1,"column":2,"choices":[],"span":1,"label":"First Name","logicReq":true},
    {"type":"Text","name":"middleName","section":"58274849e6becb2a88ae1954","row":1,"column":3,"choices":[],"span":1,"label":"Middle Initials"},
    {"name":"address","section":"58274849e6becb2a88ae1954","type":"Text","row":1,"column":4,"choices":[],"span":1,"label":"Primary Mailing Address","logicReq":true},
    {"name":"apartmentNumber","section":"58274849e6becb2a88ae1954","type":"Text","row":2,"column":1,"choices":[],"span":1,"label":"Appartment Number"},
    {"type":"Text","name":"city","section":"58274849e6becb2a88ae1954","row":2,"column":3,"choices":[],"span":1,"label":"City","logicReq":true},
    {"type":"Text","name":"buzzNumber","section":"58274849e6becb2a88ae1954","row":2,"column":2,"span":1,"label":"Buzz Number"},
    {"name":"province","section":"58274849e6becb2a88ae1954","type":"Text","row":2,"column":4,"span":1,"label":"Province"},
    {"name":"postalCode","section":"58274849e6becb2a88ae1954","type":"Text","row":3,"column":1,"span":1,"label":"Postal Code","logicReq":true},
    {"name":"telephoneNumber","section":"58274849e6becb2a88ae1954","type":"Text","row":3,"column":2,"span":1,"label":"Telephone Number","logicReq":true},
    {"name":"mobileNumber","section":"58274849e6becb2a88ae1954","type":"Text","row":3,"column":3,"span":1,"label":"Mobile Number"},
    {"name":"email","section":"58274849e6becb2a88ae1954","type":"Text","row":3,"column":4,"span":1,"label":"Email Address","logicReq":true},
    {"name":"dateOfBirth","section":"58274849e6becb2a88ae1954","type":"Date","row":4,"column":1,"span":1,"label":"Date of Birth","logicReq":true},
    {"name":"contactPreference","section":"58274849e6becb2a88ae1954","type":"Radio Buttons","choices":"Phone, Email","row":4,"column":2,"span":1,"label":"Best way to contact","logicReq":true},
    {"name":"referredBy","section":"58274849e6becb2a88ae1954","type":"Textarea","row":5,"column":1,"span":2,"label":"How did you hear about us?"},
    {"name":"volunteerReason","section":"58274849e6becb2a88ae1954","type":"Textarea","row":5,"column":3,"span":2,"label":"Why do you want to volunteer with us?"},

    {"name":"Test Field","section":"58274849e6becb2a88ae1999","type":"Checkboxes","row":8,"column":1,"span":2,"choices":"Spaghetti, Linguine, Socks","label":"Testing, testing"}

  ]
}
