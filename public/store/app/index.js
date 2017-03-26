import menu from './menu'

export default (state = {
  menu: menu({}, {type: 'INIT'})
}, action) => ({
  menu: menu(state.menu, action)
})
