import {readFileSync} from 'fs'
import {range} from 'lodash'

export default class AddressGenerator {
  constructor() {
    try {
      const file = readFileSync(`${__dirname}/addresses.csv`).toString()
      this.lines = file.split('\n').filter(x => x)
    } catch (err) {
      this.lines = []
    }

    this.indices = range(this.lines.length)
  }

  getOne() {
    if (!this.indices.length) throw new Error('No seed addresses remaining')

    const i = Math.floor(Math.random() * this.indices.length)
    const index = this.indices[i]
    this.indices.splice(i, 1)

    const [lat, lng, street, city, state, zip] = this.lines[index].split(',')

    return {
      lat,
      lng,
      street,
      city,
      state,
      zip
    }
  }
}
