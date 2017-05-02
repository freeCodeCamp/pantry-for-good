import fs from 'fs'
import {range} from 'lodash'

export default class AddressGenerator {
  constructor() {
    this.file = fs.readFileSync(`${__dirname}/addresses.csv`).toString().split('\n')
    this.indices = range(this.file.length)
  }

  getAddress() {
    const i = Math.floor(Math.random() * this.indices.length)
    this.indices = this.indices.filter(idx => idx !== i)

    if (!this.indices.length)
      throw new Error('AddressGenerator: unique addresses exhausted')

    const line = this.file[i].split(',')
      .map(s => s.replace(/"/g, ''))

    return {
      lat: line[0],
      lng: line[1],
      street: `${line[2]} ${line[3]}`,
      city: `${line[4]}`,
      state: `${line[7]}`,
      zip: `${line[9]}`
    }
  }
}
