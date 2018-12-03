import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'

import { EditUser } from './EditUser'
import { ADMIN_ROLE } from '../../../../common/constants'

Enzyme.configure({adapter: new Adapter()})

describe('EditUser Class', () => {
  let props
  let editUser
  let editUserSpy

  beforeEach(() => {
    editUserSpy = sinon.spy()
    props = {
      user: {
        firstName: 'test-first-name',
        lastName: 'test-last-name',
        email: 'test-email',
        roles: ADMIN_ROLE
      },
      getUserById: sinon.spy(),
      editUser: editUserSpy
    }
    editUser = shallow(<EditUser {...props} />)
  })
  
  describe('constructor', () => {
    it('should set the state\'s firstName according to the props', () => {
      expect(editUser.state().firstName).to.equal('test-first-name')
    })
    
    it('should set the state\'s lastName according to the props', () => {
      expect(editUser.state().lastName).to.equal('test-last-name')
    })
    
    it('should set the state\'s email according to the props', () => {
      expect(editUser.state().email).to.equal('test-email')
    })
    
    it('should set the state\'s isAdmin true for ADMIN_ROLE', () => {
      expect(editUser.state().isAdmin).to.be.true
    })
    
    it('should set the state\'s isAdmin false when not ADMIN_ROLE', () => {
      const nonAdminProps = Object.assign(props, {
        user: Object.assign(props.user, { roles: 'test-role' })
      })
      const nonAdminEditUser = shallow(<EditUser {...nonAdminProps} />)
      expect(nonAdminEditUser.state().isAdmin).to.be.false
    })
    
    it('should set the state\'s showSaveSuccessMessage to false', () => {
      expect(editUser.state().showSaveSuccessMessage).to.be.false
    })
  })
  
  describe('componentWillMount', () => {
    it('should do nothing when there is a user', () => {
      expect(props.getUserById).to.have.not.been.called
    })
    
    it('should call getUserById if there is no user', () => {
      const noUserProps = {
        match: {
          params: {
            userId: 'test-user-id'
          }
        },
        getUserById: sinon.spy()
      }
      shallow(<EditUser {...noUserProps} />)
      expect(noUserProps.getUserById).to.have.been.calledWith('test-user-id')
    })
  })
  
  describe('componentWillReceiveProps', () => {
    describe('user exists', () => {
      it('sets showSaveSuccessMessage false when props are not saving', () => {
        editUser.setState({ showSaveSuccessMessage: true })
        editUser.setProps({ saving: false})
        expect(editUser.state().showSaveSuccessMessage).to.be.false
      })
      
      it('sets showSaveSuccessMessage false when nextProps are saving', () => {
        const savingProps = Object.assign(props, { saving: true })
        const editUserSaving = shallow(<EditUser {...savingProps} />)
        editUserSaving.setState({ showSaveSuccessMessage: true })
        editUserSaving.setProps({ saving: true})
        expect(editUserSaving.state().showSaveSuccessMessage).to.be.false
      })
      
      it('sets showSaveSuccessMessage false when nextProps has saveError', () => {
        const savingProps = Object.assign(props, { saving: true })
        const editUserSaving = shallow(<EditUser {...savingProps} />)
        editUserSaving.setState({ showSaveSuccessMessage: true })
        editUserSaving.setProps({ saving: false, saveError: true})
        expect(editUserSaving.state().showSaveSuccessMessage).to.be.false
      })
      
      it('sets showSaveSuccessMessage true when props are saving, nextProps are not saving and have no saveError', () => {
        const savingProps = Object.assign(props, { saving: true })
        const editUserSaving = shallow(<EditUser {...savingProps} />)
        editUserSaving.setState({ showSaveSuccessMessage: false })
        editUserSaving.setProps({ saving: false, saveError: false})
        expect(editUserSaving.state().showSaveSuccessMessage).to.be.true
      })
      
      it('does not set user properties if user has already been set', () => {
        editUser.setProps({ user: Object.assign(
          props.user,
          { firstName: 'test-fn-edit' })})
        expect(editUser.state().firstName).to.equal('test-first-name')
      })
      
      it('sets firstName on the state', () => {
        editUser.setProps({ user: undefined })
        editUser.setProps({ user: Object.assign(
          props.user,
          { firstName: 'test-fn-edit' })})
        expect(editUser.state().firstName).to.equal('test-fn-edit')
      })
      
      it('sets lastName on the state', () => {
        editUser.setProps({ user: undefined })
        editUser.setProps({ user: Object.assign(
          props.user,
          { lastName: 'test-ln-edit' })})
        expect(editUser.state().lastName).to.equal('test-ln-edit')
      })
      
      it('sets email on the state', () => {
        editUser.setProps({ user: undefined })
        editUser.setProps({ user: Object.assign(
          props.user,
          { email: 'test-email-edit' })})
        expect(editUser.state().email).to.equal('test-email-edit')
      })
      
      it('sets isAdmin on the state', () => {
        editUser.setProps({ user: undefined })
        editUser.setProps({ user: Object.assign(
          props.user,
          { roles: 'not-admin' })})
        expect(editUser.state().isAdmin).to.be.false
      })
    })
    
    describe('onFieldChange', () => {
      it('sets the state value appropriately', () => {
        const firstName = editUser.find('[label="First Name"]')
        firstName.simulate('change', {
          target: { name: 'firstName', value: 'test-fn-edit' }
        })
        expect(editUser.state().firstName).to.equal('test-fn-edit')
      })
      
      it('sets the showSaveSuccessMessage to false', () => {
        editUser.setState({ showSaveSuccessMessage: true })
        const firstName = editUser.find('[label="First Name"]')
        firstName.simulate('change', {
          target: { name: 'firstName', value: 'test-fn-edit' }
        })
        expect(editUser.state().showSaveSuccessMessage).to.be.false
      })
    })
    
    describe('onCheckboxChange', () => {
      it('sets the state value appropriately', () => {
        const isAdmin = editUser.find('[name="isAdmin"]')
        isAdmin.simulate('change', {
          target: { name: 'isAdmin', checked: false }
        })
        expect(editUser.state().isAdmin).to.be.false
      })
      
      it('sets the showSaveSuccessMessage to false', () => {
        editUser.setState({ showSaveSuccessMessage: true })
        const isAdmin = editUser.find('[name="isAdmin"]')
        isAdmin.simulate('change', {
          target: { name: 'isAdmin', checked: false }
        })
        expect(editUser.state().showSaveSuccessMessage).to.be.false
      })
    })
    
    describe('onSubmit', () => {
      it('sets calls preventDefault on the event', () => {
        const submitButton = editUser.find('.btn-primary')
        const preventDefaultSpy = sinon.spy()
        submitButton.simulate('click', {
          preventDefault: preventDefaultSpy
        })
        expect(preventDefaultSpy).to.have.been.calledOnce
      })
      
      it('sets the showSaveSuccessMessage to false', () => {
        editUser.setState({ showSaveSuccessMessage: true })
        const submitButton = editUser.find('.btn-primary')
        submitButton.simulate('click', {
          preventDefault: sinon.spy()
        })
        expect(editUser.state().showSaveSuccessMessage).to.be.false
      })
      
      it('calls edit user with the user details', () => {
        const submitButton = editUser.find('.btn-primary')
        submitButton.simulate('click', {
          preventDefault: sinon.spy()
        })
        expect(editUserSpy).to.have.been.calledWith({
          firstName: 'test-first-name',
          lastName: 'test-last-name',
          email: 'test-email',
          isAdmin: true,
          roles: ADMIN_ROLE
        })
      })
    })
  })
})