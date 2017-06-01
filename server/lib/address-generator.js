import fs from 'fs'
import {range} from 'lodash'
import faker from 'faker'

export default class AddressGenerator {
  constructor() {
    try {
      this.file = fs.readFileSync(`${__dirname}/addresses.csv`)
        .toString().split('\n')
    } catch (err) {
      this.file = []
    }

    this.indices = this.file.length ? range(this.file.length - 1) : []
  }

  getOne() {
    if (!this.indices.length) return randomAddress()

    const i = Math.floor(Math.random() * this.indices.length)
    const index = this.indices[i]
    this.indices.splice(i, 1)

    const line = this.file[index].split(',')
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

function randomAddress() {
  return {
    lat: faker.finance.amount(51.5, 51.55, 6),
    lng: faker.finance.amount(-3.15, -3.25, 6),
    street: `${faker.random.number(1-50)} ${faker.address.streetAddress()}`,
    city: faker.address.city(),
    state: faker.address.state(),
    zip: faker.address.zipCode()
  }
}
