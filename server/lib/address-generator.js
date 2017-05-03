import fs from 'fs'
import {range} from 'lodash'

export default class AddressGenerator {
  constructor() {
    this.file = fs.readFileSync(`${__dirname}/addresses.csv`)
      .toString().split('\n').map(s => s.replace(/"/g, ''))

    this.indices = range(this.file.length - 1)
  }

  getAddress() {
    if (!this.indices.length)
      throw new Error('AddressGenerator: unique addresses exhausted')

    const i = Math.floor(Math.random() * this.indices.length)

    const line = this.file[this.indices[i]].split(',')

    this.indices.splice(i, 1)

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
