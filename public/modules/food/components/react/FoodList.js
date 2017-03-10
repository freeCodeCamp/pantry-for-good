import React from 'react'
import { Provider } from 'react-redux'

import FoodCategories from './FoodCategories'
import FoodItems from './FoodItems'

export default ({ store }) => (
    <Provider store={store}>
        <section className="content">
            <div className="row">
                <div className="col-xs-12 col-md-3 col-lg-2">
                    <FoodCategories />
                </div>
                <div className="col-xs-12 col-md-9 col-lg-10">
                    {/*<FoodItems />*/}
                </div>
            </div>
        </section>
    </Provider>
)
