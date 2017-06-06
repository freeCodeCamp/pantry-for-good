import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {Button} from 'react-bootstrap'
import ReactQuill, {Quill} from 'react-quill'
import {ImageDrop} from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.core.css'

import selectors from '../../../store/selectors'
import withConfirmNavigation from '../../../components/withConfirmNavigation'

Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/imageDrop', ImageDrop)

const quillModules = {
  toolbar: [
    [{'header': [1, 2, 3, false]}],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    [{'color': []}, {'background': []}],
    [{'font': []}],
    [{'size': ['small', false, 'large', 'huge']}],
    [{'align': []}],
    ['clean']
  ],
  imageDrop: true,
  imageResize: {modules: ['Resize', 'DisplaySize']}
}

const mapStateToProps = (state, ownProps) => ({
  page: selectors.page.getOne(state)(ownProps.selectedPage)
})

class PageEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {page: null}
  }

  componentWillReceiveProps(nextProps) {
    const {page, selectedPage} = nextProps

    if (selectedPage !== this.props.selectedPage) {
      this.setState({page: {...page}})
    }
  }

  handleChange = (value, _, source) => {
    this.setState({
      page: {
        ...this.state.page,
        body: value
      }
    })

    if (source === 'user') this.props.setDirty(true)
  }

  render() {
    const {page} = this.state
    return (
      <div>
        {page &&
          <ReactQuill
            theme="snow"
            value={page.body}
            onChange={this.handleChange}
            modules={quillModules}
          />
        }
        <div className="text-right">
          <Button
            bsStyle="success"
            disabled={!page || !this.props.dirty}
            onClick={this.props.handlePageSave(page)}
            style={{margin: '10px 0'}}
          >
            Update
          </Button>
        </div>
      </div>
    )
  }
}

export default compose(
  connect(mapStateToProps),
  withConfirmNavigation
)(PageEditor)
