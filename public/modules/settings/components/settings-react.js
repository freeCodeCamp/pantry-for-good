import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import angular from 'angular';

import AppSettings from './react/AppSettings'

export default angular.module('users')
    .component('settingsReact', {
        controller: function ($ngRedux) {

            function render(Component) {
                ReactDOM.render(
                    <AppContainer>
                        <Provider store={$ngRedux}>
                            <Component />
                        </Provider>
                    </AppContainer>,
                    document.getElementById('app-settings')
                )
            }

            render(AppSettings)

            if (module.hot) {
                module.hot.accept('../components/react/AppSettings', () => {
                    const Next = require('../components/react/AppSettings').default
                    render(Next)
                })
            }
        },
        template: '<div id="app-settings"></div>'
    })
    .name;
