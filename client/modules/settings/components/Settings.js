import React from 'react'
import { connect } from 'react-redux'
import { saveSettings } from '../reducer'

import selectors from '../../../store/selectors'
import { Box, BoxBody, BoxHeader } from '../../../components/box'
import { PageBody } from '../../../components/page'
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
    <PageBody>
      <Box>
        <BoxHeader heading="Change Settings" />
        <BoxBody loading={this.props.loading} error={this.props.error}>
          <SettingsForm
            onSubmit={this.props.saveSettings}
            initialValues={this.props.data}
          />
        </BoxBody>
      </Box>
    </PageBody>
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings)
