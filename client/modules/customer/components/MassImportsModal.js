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

      for(var i = 1; i < data.length-1; i++) {
        if(!this.validateRow(data[i])) {
          this.printErrorMessage("Format")
        }
        else {
          var firstName = data[i][0]
          var lastName = data[i][1]
          var email = data[i][2]
          var address = ""
          // var birthday = ""
          var relationship = ""

          for(var j = 3; j < data[i].length; j++) {
            if(j == 3) {
              address = data[i][j]
            } 
            // else if(j == 4) {
            //   birthday = new Date(data[i][j])
            // } 
            else if(j == 5) {
              relationship = data[i][j]
            }
          }
          // var household = []
          // household.push({name: "", relationship: relationship, dateOfBirth: birthday})
          var household = {name: "", relationship: relationship, dateOfBirth: new Date()}

          info.push({firstName: firstName, lastName: lastName, email: email, address: address, household: household})
        }
      }
      this.setState({validInput: true, documents: info})
    }
  }

  printErrorMessage = error => {
    document.getElementById("error").style.color = "red"
    if(error == "Empty") {
      document.getElementById("error").innerHTML = "Error: Empty CSV Input File."
    }
    else if(error == "Format") {
      document.getElementById("error").innerHTML = "Error: Invalid Input File Format. Please Use CSV Template."  
    }
    this.setState({validInput: false})
  }

  /* Validates header length and values */
  /* EXPECTING: [First Name, Last Name, Email, Address, Birthday, Relationship] (Only first 3 required) */
  validateHeaders = headers => {
    if(headers.length > 6 || headers.length < 3) {
      return false
    }
    else {
      var expected = ["First Name", "Last Name", "Email", "Address", "Birthday", "Relationship"]
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
    if(row.length < 3) {
      return false
    }
    else if(row[0] == "" || row[1] == "" || row[2] == "") {
      return false
    }
    return true
  }


  importData = () => {
    var docs = this.state.documents
    // console.log(docs)
    //console.log(docs[0].household.dateOfBirth)
    this.props.massUpload(docs)
    this.props.closeModal()
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
