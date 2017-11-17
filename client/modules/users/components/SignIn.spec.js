
import React from 'react'
import { shallow } from 'enzyme'

import ConnectedSignIn, { SignIn } from './SignIn'
import { signIn as authReducerSignIn, clearFlags as authReducerClearFlags } from '../authReducer'

describe('SignIn Class', function () {

  it ('Has an email field', () => {
    const wrapper = shallow(<SignIn clearFlags={ () => {} } />)
    const emailField = wrapper.find('FieldGroup[name="email"]')
    expect(emailField).to.have.length(1)
  })

  it ('Has a password field', () => {
    const wrapper = shallow(<SignIn clearFlags={ () => {} } />)
    const passwordField = wrapper.find('FieldGroup[name="password"]')
    expect(passwordField).to.have.length(1)
  })

  it ('calls props.signIn when the button is clicked', () => {
    const signInProp = sinon.spy()
    const wrapper = shallow(<SignIn signIn={signInProp} clearFlags={ () => {} } />)
    wrapper.find('button').simulate('click', { preventDefault() {} })
    expect(signInProp.called).to.eql(true)
  })

  it ('calls props.signIn with the values from the state', () => {
    const signInProp = sinon.spy()
    const wrapper = shallow(<SignIn signIn={signInProp}  clearFlags={ () => {} } />)
    wrapper.setState({email: 'user@example.com', password: '12345678'})
    wrapper.find('button').simulate('click', { preventDefault() {} })
    expect(signInProp.calledWith('user@example.com', '12345678')).to.eql(true)
  })

  it ('shows link to google sign when props.googleAuthentication', () => {
    const wrapper = shallow(<SignIn googleAuthentication clearFlags={ () => {} } />)
    const a = wrapper.find('a[href="/api/auth/google"]')
    expect(a).to.have.length(1)
  })

  it ('does not show link to google sign when not props.googleAuthentication', () => {
    const wrapper = shallow(<SignIn googleAuthentication={false} clearFlags={ () => {} } />)
    const a = wrapper.find('a[href="/api/auth/google"]')
    expect(a).to.have.length(0)
  })

  it('sets its state via this.onFieldChange()', () => {
    const wrapper = shallow(<SignIn clearFlags={ () => {} } />)
    wrapper.instance().onFieldChange({target: {name: 'email', value: 'user@example.com'}})
    wrapper.instance().onFieldChange({target: {name: 'password', value: '12345678'}})
    expect(wrapper.state().email).to.eql('user@example.com')
    expect(wrapper.state().password).to.eql('12345678')
  })
})

describe('Connect(SignIn)', function () {
  let reduxState
  let mockStore

  beforeEach(() => {
    reduxState = {
      auth: {
        user: 1,
        success: 2,
        error: 3,
        fetching: 4
      },
      settings: {
        data: { googleAuthentication: 5 }
      }
    }

    mockStore = {
      getState: () => reduxState,
      subscribe: () => {},
      dispatch: sinon.spy()
    }

  })

  it ('gets the login error from the redux store', () => {
    const wrapper = shallow(<ConnectedSignIn />, {context: {store: mockStore}})
    expect(wrapper.props().fetchUserError).to.eql(mockStore.getState().auth.error)
  })

  it ('gets the loading state from the redux store', () => {
    const wrapper = shallow(<ConnectedSignIn />, {context: {store: mockStore}})
    expect(wrapper.props().fetchingUser).to.eql(reduxState.auth.fetching)
  })

  it ('gets the googleAuthentication state from the redux store', () => {
    const wrapper = shallow(<ConnectedSignIn />, {context: {store: mockStore}})
    expect(wrapper.props().googleAuthentication).to.eql(reduxState.settings.data.googleAuthentication)
  })

  it ('dispatches the sign in action', () => {
    const wrapper = shallow(<ConnectedSignIn />, {context: {store: mockStore}})
    wrapper.props().signIn('e', 'p')
    const actualDispatchedAction = mockStore.dispatch.args[0][0]
    const expectedDispatchedAction = authReducerSignIn({email: 'e', password: 'p'})
    expect(actualDispatchedAction).to.eql(expectedDispatchedAction)
  })

  it ('dispatches the clearFlags action', () => {
    const wrapper = shallow(<ConnectedSignIn />, {context: {store: mockStore}})
    wrapper.props().clearFlags()
    const actualDispatchedAction = mockStore.dispatch.args[0][0]
    const expectedDispatchedAction = authReducerClearFlags()
    expect(actualDispatchedAction).to.eql(expectedDispatchedAction)
  })

})
