import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {Button} from 'react-bootstrap'
import ReactQuill, {Quill} from 'react-quill'
import {ImageDrop} from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.core.css'

import {pageTypes} from '../../../../common/constants'
import selectors from '../../../store/selectors'
import placeholders, {getPlaceholders, placeholderTypes} from '../../../../common/placeholders'
import {editorTypes} from '../types'
import Placeholder from '../../../lib/quill-placeholder'
import withConfirmNavigation from '../../../components/withConfirmNavigation'
import QuillBodyToolbar from './QuillBodyToolbar'
import QuillSubjectToolbar from './QuillSubjectToolbar'

Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/placeholder', Placeholder)

const getQuillBodyModules = type => ({
  toolbar: {container: `#${type}-toolbar`},
  imageDrop: true,
  imageResize: {},
  placeholder: {placeholders}
})

const quillSubjectModules = {
  toolbar: {container: '#subject-toolbar'},
  placeholder: {placeholders}
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

  handleEditorChange = editor => (value, _, source) => {
    if (this.resizeModule && this.resizeModule.img) {
      this.resizeModule.onUpdate()
    }

    this.setState({
      page: {
        ...this.state.page,
        subject: editor === editorTypes.SUBJECT ? value : this.state.page.subject,
        body: editor === editorTypes.BODY ? value : this.state.page.body
      }
    })

    if (source === Quill.sources.USER && !this.props.dirty) {
      this.props.setDirty(true)
    }
  }

  componentWillUnmount() {
    this[editorTypes.BODY] = null
    this[editorTypes.SUBJECT] = null
    this.resizeModule = null
  }

  getEditorInstance = editor => el => {
    if (el && !this[editor]) {
      const instance = el.getEditor()
      instance.getModule('history').clear()
      this[editor] = instance

      if (editor === editorTypes.BODY) {
        this.resizeModule = instance.getModule('imageResize')
      }
    }
  }

  render() {
    const {page} = this.state
    const {type} = this.props
    const bodyPlaceholders = getPlaceholders(
      type === pageTypes.EMAIL ?
        [placeholderTypes.EMAIL, placeholderTypes.ATTACHMENT] :
        []
    )

    return (
      <div className="page-editor">
        {page && page.body !== undefined &&
          <div>
            {type === pageTypes.EMAIL &&
              <div>
                <QuillSubjectToolbar
                  placeholders={getPlaceholders([placeholderTypes.EMAIL])}
                />
                <ReactQuill
                  theme="snow"
                  value={page.subject}
                  onChange={this.handleEditorChange(editorTypes.SUBJECT)}
                  modules={quillSubjectModules}
                  placeholder="Subject"
                  ref={this.getEditorInstance(editorTypes.SUBJECT)}
                />
              </div>
            }
            <QuillBodyToolbar placeholders={bodyPlaceholders} type={type} />
            <ReactQuill
              theme="snow"
              bounds=".page-editor"
              value={page.body}
              onChange={this.handleEditorChange(editorTypes.BODY)}
              modules={getQuillBodyModules(type)}
              ref={this.getEditorInstance(editorTypes.BODY)}
            />
          </div>
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
