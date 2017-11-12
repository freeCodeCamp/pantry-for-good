import React from 'react'
import {connect} from 'react-redux'
import {Col, Row} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {Box, BoxBody, BoxHeader} from '../../../components/box'
import ImageUpload from './ImageUpload'

const mapStateToProps = state => ({
  loading: selectors.media.loading(state) || selectors.media.saving(state),
  error: selectors.media.loadError(state) || selectors.media.saveError(state)
})

const Images = ({error, loading}) =>
  <Box>
    <BoxHeader heading="Images" />
    <BoxBody error={error} loading={loading}>
      <Row>
        <Col lg={4}>
          <h5>Logo</h5>
          <ImageUpload type="logo" />
        </Col>
        <Col lg={4}>
          <h5>Signature</h5>
          <ImageUpload type="signature" />
        </Col>
        <Col lg={4}>
          <h5>Icon</h5>
          <ImageUpload type="favicon" />
        </Col>
      </Row>
    </BoxBody>
  </Box>

export default connect(mapStateToProps)(Images)
