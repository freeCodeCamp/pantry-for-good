import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import {get, sortBy} from 'lodash'

import {CALL_API} from '../../store/middleware/api'
import {page as pageSchema, arrayOfPages} from '../../../common/schemas'
import {pageTypes, pageIdentifiers} from '../../../common/constants'
import {crudActions, crudReducer} from '../../store/utils'

export const actions = crudActions('page')

export const loadPages = type => ({
  [CALL_API]: {
    endpoint: `admin/pages${type ? '?type=' + type : ''}`,
    schema: arrayOfPages,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
})

export const loadPage = identifier => ({
  [CALL_API]: {
    endpoint: `pages/${identifier}`,
    schema: pageSchema,
    types: [actions.LOAD_ONE_REQUEST, actions.LOAD_ONE_SUCCESS, actions.LOAD_ONE_FAILURE]
  }
})

export const savePage = page => ({
  [CALL_API]: {
    endpoint: `admin/pages/${page.identifier}`,
    method: 'PUT',
    body: page,
    schema: pageSchema,
    types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
  }
})

export default crudReducer('page')

export const createSelectors = path => {
  const getEntities = state => state.entities

  return {
    getAll: state => type => createSelector(
      state => get(state, path).ids,
      getEntities,
      (pages, entities) => {
        const allPages = denormalize({pages}, {pages: arrayOfPages}, entities).pages
        if (!allPages.length) return []

        if (type === pageTypes.EMAIL) {
          return sortBy(
            allPages.filter(page => page.type === pageTypes.EMAIL),
            'title'
          )
        }

        const homePage = allPages.find(page => page.identifier === pageIdentifiers.HOME)
        const clientPages = allPages.filter(page =>
          page.identifier !== pageIdentifiers.HOME && page.type === pageTypes.PAGE)

        return [
          homePage,
          ...sortBy(clientPages, 'title')
        ]
      }
    )(state),
    getOne: state => identifier => createSelector(
      getEntities,
      entities => {
        const ids = Object.keys(entities.pages).filter(id =>
          entities.pages[id].identifier === identifier)
        if (!ids.length) return
        return denormalize({pages: ids[0]}, {pages: pageSchema}, entities).pages
      }
    )(state),
    loading: state => get(state, path).fetching,
    loadError: state => get(state, path).fetchError,
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
