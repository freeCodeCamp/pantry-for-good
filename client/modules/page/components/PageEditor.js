import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import ReactQuill, {Quill} from 'react-quill'
import {ImageDrop} from 'quill-image-drop-module'
// https://github.com/kensnyder/quill-image-resize-module/issues/7
// import {ImageResize} from 'quill-image-resize-module'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.core.css'

import selectors from '../../../store/selectors'
Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', ImageResize)

const quillModules = {
  toolbar: [
    [{'header': [1, 2, 3, false]}],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  imageDrop: true,
  // imageResize: {}
}

const mapStateToProps = (state, ownProps) => ({
  page: selectors.page.getOne(state)(ownProps.selectedPage)
})

class PageEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {page: null}
  }

  // componentWillMount() {
  //   const page = this.props.pages.find(page => page.identifier === this.props.selectedPage)
  //   this.setState({
  //     text: page && page.body
  //   })
  // }

  componentWillReceiveProps(nextProps) {
    const {page} = nextProps
    if (page) {
      this.setState({
        page: {...page}
      })
    }
  }

  handleChange = value => this.setState({
    page: {
      ...this.state.page,
      body: value
    }
  })

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

export default connect(mapStateToProps)(PageEditor)
