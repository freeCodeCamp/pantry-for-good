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
import placeholders, {getPlaceholders} from '../../../../common/placeholders'
import Placeholder from '../../../lib/quill-placeholder'
import withConfirmNavigation from '../../../components/withConfirmNavigation'
import QuillBodyToolbar from './QuillBodyToolbar'
import QuillSubjectToolbar from './QuillSubjectToolbar'

Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/placeholder', Placeholder)

const quillBodyModules = {
  toolbar: {container: '#quill-body-toolbar'},
  imageDrop: true,
  imageResize: {},
  placeholder: {placeholders}
}

const quillSubjectModules = {
  toolbar: {container: '#quill-subject-toolbar'},
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
      // TODO: better way to clear undo history when editor changed and initialized
      setTimeout(() => {
        this.subjectQuill && this.subjectQuill.getModule('history').clear()
        this.bodyQuill && this.bodyQuill.getModule('history').clear()
      }, 50)
    }
  }

  handleEditorChange = editor => (value, _, source) => {
    if (this.resizeModule && this.resizeModule.img) {
      this.resizeModule.onUpdate()
    }

    this.setState({
      page: {
        ...this.state.page,
        subject: editor === 'subject' ? value : this.state.page.subject,
        body: editor === 'body' ? value : this.state.page.body
      }
    })

    if (source === Quill.sources.USER && !this.props.dirty) {
      this.props.setDirty(true)
    }
  }

  getEditorInstance = editor => el => {
    if (el) this[`${editor}Quill`] = el.getEditor()
    else this[`${editor}Quill`] = null

    if (editor === 'body') this.resizeModule = el ?
      el.getEditor().getModule('imageResize') : null
  }

  render() {
    const {page} = this.state
    const {type, selectedPage} = this.props
    const placeholders = getPlaceholders(type, selectedPage)
    return (
      <div>
        {type === 'email' && page &&
          <div>
            <QuillSubjectToolbar placeholders={placeholders} />
            <ReactQuill
              theme="snow"
              value={page.subject}
              onChange={this.handleEditorChange('subject')}
              modules={quillSubjectModules}
              placeholder="Subject"
              ref={this.getEditorInstance('subject')}
            />
          </div>
        }
        {page &&
          <div>
            <QuillBodyToolbar placeholders={getPlaceholders(type)} />
            <ReactQuill
              theme="snow"
              value={page.body}
              onChange={this.handleEditorChange('body')}
              modules={quillBodyModules}
              ref={this.getEditorInstance('body')}
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
