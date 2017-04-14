import React from 'react'
import { connect } from 'react-redux'
import { saveSettings } from '../settings-reducer'

import { Box, BoxBody, BoxHeader } from '../../../components/box'
import { PageBody } from '../../../components/page'
import SettingsForm from './SettingsForm'

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

const mapStateToProps = state => ({
  data: state.settings.data,
  error: state.settings.error,
  loading: state.settings.fetching
})

const mapDispatchToProps = dispatch => ({
  saveSettings: settings => dispatch(saveSettings(settings))
})

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings)
