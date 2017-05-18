import React from 'react'

import FoodCategories from './inventory/FoodCategories'
import FoodItems from './inventory/FoodItems'

const Inventory = () => (
  <section className="content">
    <div className="row">
      <div className="col-xs-12 col-md-3 col-lg-2">
        <FoodCategories />
      </div>
      <div className="col-xs-12 col-md-9 col-lg-10">
        <FoodItems />
      </div>
    </div>
  </section>
)

export default Inventory
