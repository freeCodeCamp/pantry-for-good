import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import FoodList from '../components/react/FoodList'

angular.module('food').controller('FoodControllerReact', ['$ngRedux', function ($ngRedux) {

	render(FoodList)

	function render(Component) {
		ReactDOM.render(
			<AppContainer>
				<Component store={$ngRedux} />
			</AppContainer>,
			document.getElementById('food-list-react')
		)
	}
	if (module.hot) {
		module.hot.accept('../components/react/FoodList', () => {
			const Next = require('../components/react/FoodList').default
			render(Next)
		})
	}

}])
