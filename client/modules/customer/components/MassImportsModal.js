import React from 'react'
import { Button } from 'react-bootstrap'
import { Box, BoxHeader, BoxBody } from '../../../components/box'

import CSVReader from 'react-csv-reader'

export default class MassImportsModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      validInput: false,
      documents: []
    }
  }

  handleInput = data => {
    /* Error Checking for Empty File */
    if(data.length == 0 || data.length == 1 || data.length == 2 || data[0][0] == "") {
      this.printErrorMessage("Empty")
    }
    /* Error Checking for Header Format */
    else if (!this.validateHeaders(data[0])) {
      this.printErrorMessage("Format")
    }
    else {
      document.getElementById("error").innerHTML = ""
      var info = []

      const customers = this.props.customers

      for(var i = 1; i < data.length-1; i++) {
        if(!this.validateRow(data[i])) {
          this.printErrorMessage("Row")
        }
        else {
          var firstName = data[i][0]
          var lastName = data[i][1]
          var email = data[i][2]
          var birthday = new Date(data[i][3])

          if(isNaN(birthday.getTime())) {
            continue
          }


          var street = data[i][4]
          var city = data[i][5]
          var state = data[i][6]
          var zip = data[i][7]

          // Don't add this entry if it's a duplicate
          if(this.isDuplicate(firstName, lastName, email, customers) == true || this.isDuplicate(firstName, lastName, email, info) == true) {
            continue
          }


          /* 
          ** The meta field was taken from the Questionnaire model. I'm not sure what it is, 
          ** but it's a required field.
          */
          var fields = []
          fields.push({meta: "c523b236-cf40-47fc-94d4-1f5ae9ccd3c1", value: street})
          fields.push({meta: "d2cd8ff9-d70a-4316-a970-5c9a11dc0076", value: city})
          fields.push({meta: "d4b7113c-9943-4858-893c-1b2512533f46", value: state})
          fields.push({meta: "ce470f63-9c6f-401f-8c85-c9fef022be90", value: zip})
          fields.push({meta: "8a537855-657a-476f-98cc-3f8c6313532d", value: birthday})          

          info.push({firstName: firstName, lastName: lastName, email: email, fields: fields})
        }
      }
      if(info.length > 262) {
        this.printErrorMessage("Size")
      }
      else {
        this.setState({validInput: true, documents: info})
      }
    }
  }

  // Determines if customer is a duplicate
  // I use email as well in the edge case that there are 2 people
  // with the same name
  isDuplicate = (firstName, lastName, email, customers) => {
    for(var i = 0; i < customers.length; i++) {
      if(customers[i].firstName.toLowerCase() == firstName.toLowerCase() && 
          customers[i].lastName.toLowerCase() == lastName.toLowerCase() &&
          customers[i].email.toLowerCase() == email.toLowerCase()) {

        return true
      }
    }
    return false
  }

  printErrorMessage = error => {
    document.getElementById("error").style.color = "red"
    if(error == "Empty") {
      document.getElementById("error").innerHTML = "Error: Empty CSV Input File."
    }
    else if(error == "Format") {
      document.getElementById("error").innerHTML = "Error: Invalid Input File Format. Please Use CSV Template."  
    }
    else if(error == "Size") {
      document.getElementById("error").innerHTML = "Error: Too Many Entries. 262 is Maximum Number of Entries for One Upload."  
    }
    else if(error == "Row") {
      document.getElementById("error").innerHTML = "Warning: File Contains Some Invalid Rows. Rows will be Ignored."  
    }
    this.setState({validInput: false})
  }

  /* Validates header length and values */
  validateHeaders = headers => {
    if(headers.length != 8) {
      return false
    }
    else {
      var expected = ["First Name", "Last Name", "Email", "Birthday", "Street", "City/Town", "State/Province", "ZIP"]
      for(var i = 0; i < headers.length; i++) {
        if(headers[i] != expected[i]) {
          return false
        }
      }
    }
    return true
  }

  /* Validates that a row has the correct informaiton and no blanks for required fields */
  validateRow = row => {
    if(row.length != 8) {
      return false
    }
    else {
      for(var i = 0; i < row.length; i++) {
        if(row[i] == "") {
          return false
        }
      }
    }
    return true
  }


  importData = () => {
    var docs = this.state.documents
    const customer = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.com'
    }
    this.props.massUpload({
      ...customer, 
      docs: docs
    })
    this.props.closeModal()
    location.reload()
  }


  handleError = () => {
    document.getElementById("error").innerHTML = "Weird error"
  }

  render = () => {
    return (
      <Box>
        <BoxHeader>
          Customer Mass Imports
        </BoxHeader>
        <BoxBody>
          <div id="error"></div>
          <CSVReader
            cssClass="csv-reader-input"
            label="Select a CSV file to import"
            onFileLoaded={this.handleInput}
            onError={this.handleError}
          />
          <div className="pull-right btn-toolbar">
            <Button onClick={this.props.closeModal}>Cancel</Button>
            <Button className={this.state.validInput && 'btn-success'}
              onClick={this.importData}
              disabled={!this.state.validInput}>
              Import Data
            </Button>            
          </div>             
        </BoxBody>
      </Box>
    )
  }
}
