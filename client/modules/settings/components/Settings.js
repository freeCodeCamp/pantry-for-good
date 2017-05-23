import React from 'react'
import { connect } from 'react-redux'
import { saveSettings } from '../reducers/settings'

import selectors from '../../../store/selectors'
import { Page, PageBody, PageHeader } from '../../../components/page'
import SettingsForm from './SettingsForm'

const mapStateToProps = state => ({
  data: selectors.settings.getSettings(state),
  error: selectors.settings.error(state),
  loading: selectors.settings.fetching(state)
})

const mapDispatchToProps = dispatch => ({
  saveSettings: settings => dispatch(saveSettings(settings))
})

class AppSettings extends React.Component {
  onSubmit = settings => this.props.saveSettings(settings)

  render = () =>
    <Page>
      <PageHeader heading="Settings" />
      <PageBody>
        <SettingsForm
          onSubmit={this.props.saveSettings}
          initialValues={this.props.data}
        />
      </PageBody>
    </Page>
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings)
