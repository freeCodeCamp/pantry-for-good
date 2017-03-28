import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {AppContainer} from 'react-hot-loader'
import SignUp from '../components/react/SignUp'

angular.module('users').controller('SignUpControllerReact', ['$ngRedux', function ($ngRedux) {

	render(SignUp)

	function render(Component) {
		ReactDOM.render(
			<AppContainer>
				<Provider store={$ngRedux}>
					<Component />
				</Provider>
			</AppContainer>,
			document.getElementById('singup-react')
		)
	}
	if (module.hot) {
		module.hot.accept('../components/react/SignUp', () => {
			const Next = require('../components/react/SignUp').default
			render(Next)
		})
	}

}])
