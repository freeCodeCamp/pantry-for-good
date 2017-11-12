import React from 'react'

import FoodCategories from './inventory/FoodCategories'
import FoodItems from './inventory/FoodItems'

const Inventory = () => (
  <section className="content">
    <div className="row">
      <div className="col-xs-12 col-md-4 col-lg-3">
        <FoodCategories />
      </div>
      <div className="col-xs-12 col-md-8 col-lg-9">
        <FoodItems />
      </div>
    </div>
  </section>
)

export default Inventory
