import React, { Component } from 'react'
import { Provider } from 'react-redux'

import FoodCategories from './FoodCategories'
import FoodItems from './FoodItems'

class FoodList extends Component {

    render() {
        return (
            <Provider store={this.props.ngRedux}>
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
    }
}

export default FoodList
