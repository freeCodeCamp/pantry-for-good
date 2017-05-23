import React, {Component} from 'react'
import {connect} from 'react-redux'

import selectors from '../../../store/selectors'
import {loadPages, savePage} from '../reducer'
import {Page, PageBody, PageHeader} from '../../../components/page'
import {Box, BoxBody} from '../../../components/box'
import PageSelector from './PageSelector'
import PageEditor from './PageEditor'

const mapStateToProps = state => ({
  pages: selectors.page.getAll(state),
  loading: selectors.page.loading(state) || selectors.page.saving(state),
  error: selectors.page.loadError(state) || selectors.page.saveError(state)
})

const mapDispatchToProps = dispatch => ({
  loadPages: () => dispatch(loadPages()),
  savePage: page => () => dispatch(savePage(page))
})

class EditPages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPage: ''
    }
  }

  componentWillMount() {
    this.props.loadPages()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading && !nextProps.error)
      this.setState({selectedPage: nextProps.pages[0].identifier})
  }

  handlePageSelect = identifier => this.setState({selectedPage: identifier})

  render() {
    const {pages, loading, error} = this.props

    return (
      <Page>
        <PageHeader heading="Edit Pages" />
        <PageBody>
          <Box>
            <BoxBody
              loading={loading}
              error={error}
            >
              <PageSelector
                selectedPage={this.state.selectedPage}
                handlePageSelect={this.handlePageSelect}
              />
              {pages &&
                <PageEditor
                  selectedPage={this.state.selectedPage}
                  handlePageSave={this.props.savePage}
                />
              }
            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPages)
