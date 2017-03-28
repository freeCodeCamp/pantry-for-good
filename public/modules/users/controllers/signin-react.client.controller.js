import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import SignIn from '../components/react/SignIn'

angular.module('users').controller('SignInControllerReact', ['$ngRedux', function ($ngRedux) {

	render(SignIn)

	function render(Component) {
		ReactDOM.render(
			<AppContainer>
				<Component store={$ngRedux} />
			</AppContainer>,
			document.getElementById('singin-react')
		)
	}
	if (module.hot) {
		module.hot.accept('../components/react/SignIn', () => {
			const Next = require('../components/react/SignIn').default
			render(Next)
		})
	}

}])
