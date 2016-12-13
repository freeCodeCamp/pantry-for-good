module.exports = {
	questionnaires: [
		{"_id":"581da83d367d0b1eef2e8d9e","name":"Client Questionnaire","description":"Information on clients","identifier":"qClients"},
		{"_id":"581ef88d057e8e14eb765ebd","name":"Volunteer Questionnaire","description":"Information on volunteers","identifier":"qVolunteers"},
		{"_id":"5826409b866b5221e17f3eed","name":"Donor Questionnaire","description":"Information on donors","identifier":"qDonors"},
		{"_id":"584d409f7bdef8226679dfdd","name":"Test Only","identifier":"qTest"}
	],
	sections: [
		{"_id":"582741dd11135a29f2debb41","questionnaire":"5826409b866b5221e17f3eed","name":"General Information","position":1},
		{"_id":"5827429e8bb9292a51aedbb6","name":"B Employment","questionnaire":"581da83d367d0b1eef2e8d9e","position":2},
		{"_id":"582742f58bb9292a51aedbb7","name":"C History","questionnaire":"581ef88d057e8e14eb765ebd","position":1},
		{"_id":"58274c48d3a1ae2d27071be3","name":"A General Information","position":1,"questionnaire":"581da83d367d0b1eef2e8d9e"},
		{"_id":"584d40ab7bdef8226679dfde","name":"Test Section","questionnaire":"584d409f7bdef8226679dfdd","position":1}
	],
	fields: [
		{"_id":"58274849e6becb2a88ae19ca","type":"Text","name":"lastName","section":"58274c48d3a1ae2d27071be3","row":2,"column":1,"choices":[],"span":1,"label":"Last Name","logicReq":true},
		{"_id":"58274c89d3a1ae2d27071be6","type":"Text","name":"firstName","section":"58274c48d3a1ae2d27071be3","row":2,"column":2,"choices":[],"span":1,"label":"First Name","logicReq":true},
		{"_id":"58319c541d3b0a227e2ad638","type":"Text","name":"middleName","section":"58274c48d3a1ae2d27071be3","row":2,"column":3,"choices":[],"span":1,"label":"Middle Initials"},
		{"_id":"58319c671d3b0a227e2ad639","name":"address","section":"58274c48d3a1ae2d27071be3","type":"Text","row":2,"column":4,"choices":[],"span":1,"label":"Primary Mailing Address","logicReq":true},
		{"_id":"58319c741d3b0a227e2ad63a","name":"apartmentNumber","section":"58274c48d3a1ae2d27071be3","type":"Text","row":3,"column":1,"choices":[],"span":1,"label":"Appartment Number"},
		{"_id":"5831fff5d605392b6119505b","type":"Text","name":"city","section":"58274c48d3a1ae2d27071be3","row":3,"column":3,"choices":[],"span":1,"label":"City","logicReq":true},
		{"_id":"583b0998a9ba171b5393d097","type":"Radio Buttons","name":"empWorkStatus","section":"5827429e8bb9292a51aedbb6","choices":"Employed, Unemployed, Laid-off, Retired, Disabled, Student","row":1,"column":1,"span":2,"label":"Current work status","logicReq":true},
		{"_id":"5842c85bc1513e40da714333","type":"Radio Buttons","name":"language","section":"58274c48d3a1ae2d27071be3","choices":"English, Other","row":1,"column":1,"span":1,"label":"Preferred language","logicReq":true},
		{"_id":"5842c9b8c1513e40da714334","type":"Text","name":"buzzNumber","section":"58274c48d3a1ae2d27071be3","row":3,"column":2,"span":1,"label":"Buzz Number"},
		{"_id":"5842c9ecc1513e40da714335","name":"province","section":"58274c48d3a1ae2d27071be3","type":"Text","row":3,"column":4,"span":1,"label":"Province"},
		{"_id":"5842ca39c1513e40da714336","name":"postalCode","section":"58274c48d3a1ae2d27071be3","type":"Text","row":4,"column":1,"span":1,"label":"Postal Code","logicReq":true},
		{"_id":"5842ca46c1513e40da714337","name":"telephoneNumber","section":"58274c48d3a1ae2d27071be3","type":"Text","row":4,"column":2,"span":1,"label":"Telephone Number","logicReq":true},
		{"_id":"5842ca55c1513e40da714338","name":"mobileNumber","section":"58274c48d3a1ae2d27071be3","type":"Text","row":4,"column":3,"span":1,"label":"Mobile Number"},
		{"_id":"5842caf6c1513e40da714339","name":"email","section":"58274c48d3a1ae2d27071be3","type":"Text","row":4,"column":4,"span":1,"label":"Email Address","logicReq":true},
		{"_id":"5842cb21c1513e40da71433a","name":"dateOfBirth","section":"58274c48d3a1ae2d27071be3","type":"Date","row":5,"column":1,"span":1,"label":"Date of Birth","logicReq":true},
		{"_id":"5842cb2ec1513e40da71433b","name":"gender","section":"58274c48d3a1ae2d27071be3","type":"Radio Buttons","choices":"Male, Female","row":5,"column":2,"span":1,"label":"Gender","logicReq":true},
		{"_id":"5842cb50c1513e40da71433c","name":"accommodationType","section":"58274c48d3a1ae2d27071be3","type":"Radio Buttons","choices":"Rental, Own, Subsidized, Other","row":5,"column":3,"span":1,"label":"Accommodation Type","logicReq":true},
		{"_id":"5842e0b2bbfea846fa107bd7","name":"contactPreference","section":"58274c48d3a1ae2d27071be3","type":"Radio Buttons","choices":"Phone, Email","row":5,"column":4,"span":1,"label":"Best way to contact","logicReq":true},
		{"_id":"5842e18937501c471de99ee8","name":"deliveryInstructions","section":"58274c48d3a1ae2d27071be3","type":"Textarea","row":7,"column":1,"span":2,"label":"Box delivery instructions"},
		{"_id":"5842e34e37501c471de99ee9","name":"dietaryRequest","section":"58274c48d3a1ae2d27071be3","type":"Textarea","row":7,"column":3,"span":2,"label":"Please list any food allergies or sensitivities"},
		{"_id":"5842e76037501c471de99eea","name":"assistanceInformation","section":"58274c48d3a1ae2d27071be3","type":"Textarea","row":8,"column":1,"span":2,"label":"Please name all of the organizations you are currently receiving assistance from"},
		{"_id":"5842e78837501c471de99eeb","name":"generalNotes","section":"58274c48d3a1ae2d27071be3","type":"Textarea","row":8,"column":3,"span":2,"label":"General Notes"},
		{"_id":"58485810eb64db0a910ec65d","name":"Test Field","section":"584d40ab7bdef8226679dfde","type":"Checkboxes","row":9,"column":1,"span":2,"choices":"Spaghetti, Linguine, Socks","label":"Testing, testing"},
		{"_id":"584d897b292705231f85c15d","label":"Hours per week","name":"hoursPerWeek","section":"5827429e8bb9292a51aedbb6","type":"Text","row":1,"column":3,"span":1,"logicReq":true},
		{"_id":"584d8a3e292705231f85c15f","label":"Job title","name":"jobTitle","section":"5827429e8bb9292a51aedbb6","type":"Text","row":1,"column":4,"span":1,"logicReq":true}
	]
};
