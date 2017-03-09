import React from 'react'
import ReactDOM from 'react-dom'
import FoodList from '../components/react/FoodList'
import { loadFoods } from '../../../store/food-category'

(function () {

	angular.module('food').controller('FoodControllerReact', ['$ngRedux', function ($ngRedux) {
		const action = loadFoods();
		$ngRedux.dispatch(action);

		ReactDOM.render(
			<FoodList ngRedux={$ngRedux} />,
			document.getElementById('food-list-react')
		)

	}])

})()
