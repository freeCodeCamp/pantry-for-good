import React, {Component} from 'react'
import {connect} from 'react-redux'
import get from 'lodash/get'

import selectors from '../../../store/selectors'
import {loadMedia, saveMedia} from '../reducer'
import FoodbankLogo from '../../../components/FoodbankLogo'

const mapStateToProps = state => ({
  media: selectors.media.getMedia(state)
})

const mapDispatchToProps = dispatch => ({
  loadMedia: () => dispatch(loadMedia()),
  saveMedia: file => dispatch(saveMedia(file)),
  push: (route, params, options) => dispatch(stateGo(route, params, options))
})

class Media extends Component {
  componentWillMount() {
    this.props.loadMedia()
  }

  upload = ev => {
    ev.preventDefault()
    this.props.saveMedia(this.fileInput.files[0])
  }

  handleFileChange = () => {
    const file = get(this.fileInput, 'files[0]')
    if (!file) return this.preview.src = ''

    var reader = new FileReader()
    reader.onload = ev => this.preview.src = ev.target.result
    reader.readAsDataURL(this.fileInput.files[0])
  }

  render() {
    return (
      <section className="change-media content">
        <div className="box box-solid box-primary">
          <div className="box-header">
            <h3 className="box-title">CURRENT LOGO</h3>
          </div>
          <div className="box-body">
            <div className="row">
              <div className="col-sm-6 col-md-4 col-lg-2">
                <FoodbankLogo />
              </div>
            </div>
          </div>
        </div>
        <div className="box box-solid box-primary">
          <div className="box-header">
            <h3 className="box-title">CHANGE LOGO</h3>
          </div>
          <div className="box-body">
            <div className="row">
              <div className="col-sm-6 col-md-4 col-lg-2">
                <form name="file-upload" onSubmit={this.upload}>
                  <input
                    type="file"
                    onChange={this.handleFileChange}
                    multiple={false}
                    ref={el => this.fileInput = el}
                  />
                  <img
                    style={{maxHeight: '150px'}}
                    ref={el => this.preview = el}
                  />
                  <button className="btn btn-success btn-block top-buffer" type="submit">
                    Upload Logo
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Media)
