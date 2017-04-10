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

export const customerFields = [
	// Section A, General Info
	{'type':'Radio Buttons','name':'language','section':0,'choices':'English, Other','row':1,'column':1,'span':1,'label':'Preferred language','logicReq':true},
	{'type':'Text','name':'lastName','section':0,'row':2,'column':1,'choices':[],'span':1,'label':'Last Name','logicReq':true},
	{'type':'Text','name':'firstName','section':0,'row':2,'column':2,'choices':[],'span':1,'label':'First Name','logicReq':true},
	{'type':'Text','name':'middleName','section':0,'row':2,'column':3,'choices':[],'span':1,'label':'Middle Initials'},
	{'name':'address','section':0,'type':'Text','row':2,'column':4,'choices':[],'span':1,'label':'Primary Mailing Address','logicReq':true},
	{'name':'apartmentNumber','section':0,'type':'Text','row':3,'column':1,'choices':[],'span':1,'label':'Appartment Number'},
	{'type':'Text','name':'city','section':0,'row':3,'column':3,'choices':[],'span':1,'label':'City','logicReq':true},
	{'type':'Text','name':'buzzNumber','section':0,'row':3,'column':2,'span':1,'label':'Buzz Number'},
	{'name':'province','section':0,'type':'Text','row':3,'column':4,'span':1,'label':'Province'},
	{'name':'postalCode','section':0,'type':'Text','row':4,'column':1,'span':1,'label':'Postal Code','logicReq':true},
	{'name':'telephoneNumber','section':0,'type':'Text','row':4,'column':2,'span':1,'label':'Telephone Number','logicReq':true},
	{'name':'mobileNumber','section':0,'type':'Text','row':4,'column':3,'span':1,'label':'Mobile Number'},
	{'name':'email','section':0,'type':'Text','row':4,'column':4,'span':1,'label':'Email Address','logicReq':true},
	{'name':'dateOfBirth','section':0,'type':'Date','row':5,'column':1,'span':1,'label':'Date of Birth','logicReq':true},
	{'name':'gender','section':0,'type':'Radio Buttons','choices':'Male, Female','row':5,'column':2,'span':1,'label':'Gender','logicReq':true},
	{'name':'accommodationType','section':0,'type':'Radio Buttons','choices':'Rental, Own, Subsidized, Other','row':5,'column':3,'span':1,'label':'Accommodation Type','logicReq':true},
	{'name':'contactPreference','section':0,'type':'Radio Buttons','choices':'Phone, Email','row':5,'column':4,'span':1,'label':'Best way to contact','logicReq':true},
	{'name':'deliveryInstructions','section':0,'type':'Textarea','row':6,'column':1,'span':2,'label':'Box delivery instructions'},
	{'name':'assistanceInformation','section':0,'type':'Textarea','row':6,'column':3,'span':2,'label':'Please name all of the organizations you are currently receiving assistance from'},
	{'name':'generalNotes','section':0,'type':'Textarea','row':7,'column':1,'span':2,'label':'General Notes'},

	// Section B, Employment
	{'type':'Radio Buttons','name':'empWorkStatus','section':1,'choices':'Employed, Unemployed, Laid-off, Retired, Disabled, Student','row':1,'column':1,'span':2,'label':'Current work status','logicReq':true},
	{'label':'Hours per week','name':'hoursPerWeek','section':1,'type':'Text','row':1,'column':3,'span':1,'logicReq':true},
	{'label':'Job title','name':'jobTitle','section':1,'type':'Text','row':1,'column':4,'span':1,'logicReq':true},

	// Section C, Food Preferences
	{'name':'foodPreferences','section':2,'type':'Lookup','row':1,'column':1,'span':4,'label':'Please select all food preferences that apply for you','logicReq':true},
	{'name':'dietaryRequest','section':2,'type':'Textarea','row':2,'column':1,'span':2,'label':'Please list any food allergies or sensitivities'},
	{'name':'foodPreferencesOther','section':2,'type':'Textarea','row':2,'column':3,'span':2,'label':'Other food preferences'},

	// Section D, Financial Assessment
	{'label' : 'ROWS: Rent, mortgage or room and board; Food; Utilities (phone, internet, water, heat/hydro); Transportation, parking and other personal supports; Dependant Care (eg. day care); Disability Needs; Spousal/Child support; Loans; Leases; Insurance; Credit card debt; Property taxes; Other costs not listed above COLUMNS: PART 2 - MONTHLY LIVING EXPENSES; Household', 'name' : 'financialAssessment.expenses', 'section' : 3, 'type' : 'Table', 'row' : 2, 'column' : 1, 'span' : 1},
	{'label' : 'ROWS: Employment Income; Employment Insurance Benefits; Social Assistance; Spousal/Child Support; Self Employment; Pension Income (eg. Employer Plan); Disability Income; Workplace Safety and Insurance Board (WSIB) Benefits; Pension Plan; Child Tax Benefits; Income from Rental Property; Severance/Termination Pay;Any other source of income not listed above  COLUMNS: PART 1 - MONTHLY GROSS INCOME; Self; Other', 'name' : 'financialAssessment.income', 'section' : 3, 'type' : 'Table', 'row' : 1, 'column' : 1, 'span' : 1}
]

export const donorFields = [
	{"type":"Text","name":"lastName","section":0,"row":1,"column":1,"choices":[],"span":1,"label":"Last Name","logicReq":true},
	{"type":"Text","name":"firstName","section":0,"row":1,"column":2,"choices":[],"span":1,"label":"First Name","logicReq":true},
	{"type":"Text","name":"middleName","section":0,"row":1,"column":3,"choices":[],"span":1,"label":"Middle Initials"},
	{"name":"address","section":0,"type":"Text","row":1,"column":4,"choices":[],"span":1,"label":"Primary Mailing Address","logicReq":true},
	{"name":"apartmentNumber","section":0,"type":"Text","row":2,"column":1,"choices":[],"span":1,"label":"Appartment Number"},
	{"type":"Text","name":"city","section":0,"row":2,"column":3,"choices":[],"span":1,"label":"City","logicReq":true},
	{"type":"Text","name":"buzzNumber","section":0,"row":2,"column":2,"span":1,"label":"Buzz Number"},
	{"name":"province","section":0,"type":"Text","row":2,"column":4,"span":1,"label":"Province"},
	{"name":"postalCode","section":0,"type":"Text","row":3,"column":1,"span":1,"label":"Postal Code","logicReq":true},
	{"name":"telephoneNumber","section":0,"type":"Text","row":3,"column":2,"span":1,"label":"Telephone Number","logicReq":true},
	{"name":"mobileNumber","section":0,"type":"Text","row":3,"column":3,"span":1,"label":"Mobile Number"},
	{"name":"email","section":0,"type":"Text","row":3,"column":4,"span":1,"label":"Email Address","logicReq":true},
	{"name":"referredBy","section":0,"type":"Textarea","row":4,"column":1,"span":2,"label":"How did you hear about us?"}
]

export const volunteerFields = [
	{"type":"Text","name":"lastName","section":0,"row":1,"column":1,"choices":[],"span":1,"label":"Last Name","logicReq":true},
	{"type":"Text","name":"firstName","section":0,"row":1,"column":2,"choices":[],"span":1,"label":"First Name","logicReq":true},
	{"type":"Text","name":"middleName","section":0,"row":1,"column":3,"choices":[],"span":1,"label":"Middle Initials"},
	{"name":"address","section":0,"type":"Text","row":1,"column":4,"choices":[],"span":1,"label":"Primary Mailing Address","logicReq":true},
	{"name":"apartmentNumber","section":0,"type":"Text","row":2,"column":1,"choices":[],"span":1,"label":"Appartment Number"},
	{"type":"Text","name":"city","section":0,"row":2,"column":3,"choices":[],"span":1,"label":"City","logicReq":true},
	{"type":"Text","name":"buzzNumber","section":0,"row":2,"column":2,"span":1,"label":"Buzz Number"},
	{"name":"province","section":0,"type":"Text","row":2,"column":4,"span":1,"label":"Province"},
	{"name":"postalCode","section":0,"type":"Text","row":3,"column":1,"span":1,"label":"Postal Code","logicReq":true},
	{"name":"telephoneNumber","section":0,"type":"Text","row":3,"column":2,"span":1,"label":"Telephone Number","logicReq":true},
	{"name":"mobileNumber","section":0,"type":"Text","row":3,"column":3,"span":1,"label":"Mobile Number"},
	{"name":"email","section":0,"type":"Text","row":3,"column":4,"span":1,"label":"Email Address","logicReq":true},
	{"name":"dateOfBirth","section":0,"type":"Date","row":4,"column":1,"span":1,"label":"Date of Birth","logicReq":true},
	{"name":"contactPreference","section":0,"type":"Radio Buttons","choices":"Phone, Email","row":4,"column":2,"span":1,"label":"Best way to contact","logicReq":true},
	{"name":"referredBy","section":0,"type":"Textarea","row":5,"column":1,"span":2,"label":"How did you hear about us?"},
	{"name":"volunteerReason","section":0,"type":"Textarea","row":5,"column":3,"span":2,"label":"Why do you want to volunteer with us?"}
]
