import React from 'react'
import ReactDOM from 'react-dom'
import FoodList from '../components/react/FoodList'

(function () {

	angular.module('food').controller('FoodControllerReact', ['$ngRedux', function ($ngRedux) {

		ReactDOM.render(
			<FoodList store={$ngRedux} />,
			document.getElementById('food-list-react')
		)

	}])

})()
