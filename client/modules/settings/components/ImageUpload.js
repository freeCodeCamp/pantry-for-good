import React, {Component} from 'react'
import {connect} from 'react-redux'
import {get} from 'lodash'
import {Button} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {loadMedia, saveMedia} from '../reducers/media'

const mapStateToProps = state => ({
  media: selectors.media.getMedia(state),
  saving: selectors.media.saving(state)
})

const mapDispatchToProps = dispatch => ({
  loadMedia: () => dispatch(loadMedia()),
  saveMedia: (type, file) => dispatch(saveMedia(type, file))
})

class ImageUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: '',
      preview: '',
      saving: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.saving && !nextProps.saving && this.state.saving) {
      this.setState({
        saving: false,
        file: '',
        preview: ''
      })
    }
  }

  handleImageChange = ev => {
    const file = get(ev.target, 'files[0]')
    this.setState({file})

    if (!file) return this.setState({preview: ''})

    const reader = new FileReader()
    reader.onload = ev => this.setState({preview: ev.target.result})
    reader.readAsDataURL(file)
  }

  upload = ev => {
    ev.preventDefault()
    this.setState({saving: true})
    this.props.saveMedia(this.props.type, this.state.file)
  }

  render() {
    const {type, media} = this.props
    const {preview} = this.state
    const {handleImageChange, upload} = this

    return (
      <form name={`${type}-upload`} onSubmit={upload}>{/*http://stackoverflow.com/questions/1077041/refresh-image-with-a-new-one-at-the-same-url*/}
        <div style={{
          height: '150px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <img
            src={preview || media &&
              `${media.path}/${media[type]}?t=${new Date().getTime()}`}
            style={{
              maxHeight: '150px',
              margin: '0 auto'
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          alignContent: 'space-around',
          alignItems: 'center'
        }}>
          <input
            type="file"
            name={type}
            onChange={handleImageChange}
            multiple={false}
          />
          <Button
            bsStyle="success"
            type="submit"
            disabled={!preview}
          >
            Upload
          </Button>
        </div>
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageUpload)
