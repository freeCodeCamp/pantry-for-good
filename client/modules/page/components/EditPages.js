import React, {Component} from 'react'
import {connect} from 'react-redux'
import {compose, withProps} from 'recompose'
import {capitalize, last} from 'lodash'

import selectors from '../../../store/selectors'
import {loadPages, savePage} from '../reducer'
import {showNavDialog, hideDialog} from '../../core/reducers/dialog'
import {Page, PageBody, PageHeader} from '../../../components/page'
import {Box, BoxBody} from '../../../components/box'
import PageSelector from './PageSelector'
import PageEditor from './PageEditor'

const withPageType = withProps(({location}) => ({
  type: last(location.pathname.split('/')) === 'emails' ? 'email' : 'page'
}))

const mapStateToProps = (state, ownProps) => ({
  pages: selectors.page.getAll(state)(ownProps.type),
  loading: selectors.page.loading(state),
  saving: selectors.page.saving(state),
  error: selectors.page.loadError(state) || selectors.page.saveError(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadPages: () => dispatch(loadPages(ownProps.type)),
  savePage: page => () => dispatch(savePage(page)),
  showDialog: (cancel, confirm) => dispatch(showNavDialog(cancel, confirm)),
  hideDialog: () => dispatch(hideDialog())
})

class EditPages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPage: '',
      dirty: false
    }
  }

  componentWillMount() {
    this.props.loadPages()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading && !nextProps.error)
      this.setState({selectedPage: nextProps.pages[0].identifier})

    if (this.props.saving && !nextProps.saving && !nextProps.error)
      this.setState({dirty: false})
  }

  selectPage = page => () => {
    this.setState({selectedPage: page, dirty: false})
    this.props.hideDialog()
  }

  handlePageSelect = identifier => {
    if (this.state.dirty)
      this.props.showDialog(this.props.hideDialog, this.selectPage(identifier))
    else
      this.selectPage(identifier)()
  }

  setPageDirty = dirty => this.setState({dirty})

  render() {
    const {loading, saving, error, type} = this.props

    return (
      <Page>
        <PageHeader heading={`Edit ${capitalize(type)}s`} />
        <PageBody>
          <Box>
            <BoxBody
              loading={loading || saving}
              error={error}
            >
              <PageSelector
                selectedPage={this.state.selectedPage}
                handlePageSelect={this.handlePageSelect}
                type={type}
              />
                <PageEditor
                  selectedPage={this.state.selectedPage}
                  handlePageSave={this.props.savePage}
                  setDirty={this.setPageDirty}
                  dirty={this.state.dirty}
                  type={type}
                />
            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default compose(
  withPageType,
  connect(mapStateToProps, mapDispatchToProps)
)(EditPages)
