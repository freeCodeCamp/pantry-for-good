import React from 'react'
import { Button } from 'react-bootstrap'
import { Box, BoxHeader, BoxBody } from '../../../../components/box'

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
      //console.log("1")
      this.printErrorMessage("Empty")
    }
    /* Error Checking for Header Format */
    else if (!this.validateHeaders(data[0])) {
      //console.log(data[0])
      this.printErrorMessage("Format")
    }
    else {
      document.getElementById("error").innerHTML = ""
      var info = []

      for(var i = 1; i < data.length-1; i++) {
        if(!this.validateRow(data[i])) {
          //console.log("3")
          this.printErrorMessage("Format")
        }
        else {
          var category = data[i][0]
          var foodName = data[i][1]
          var quantity = Number(data[i][4])

          info.push({foodName: foodName, quantity: quantity, category: category})
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
  validateHeaders = headers => {
    if(headers.length != 8) {
      return false
    }
    else {
      var expected = ["Category", "Product", "Item Number", "Location", "Current Quantity", "Weight", "Desired Quantity", "Desired Weight"]
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
      if(row[0] == "" || row[1] == "" || row[4] == "")
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
    const foodItem = {
      name: 'test',
      quantity: 0
    }
    this.props.massUpload({
      ...foodItem, 
      docs: docs
    })
    this.props.closeMassImportModal()
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
            <Button onClick={this.props.closeMassImportModal}>Cancel</Button>
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
