import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Parser, ProcessNodeDefinitions} from 'html-to-react'

import selectors from '../store/selectors'
import {loadPage} from '../modules/page/reducer'

import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.core.css'

const htmlToReactParser = new Parser()
const processNodeDefinitions = new ProcessNodeDefinitions(React)

const getProcessingInstructions = bindings => [{
  // convert internal links to Link components
  shouldProcessNode: node => node.name && node.name === 'a' &&
    node.attribs.href.startsWith('/'),
  processNode: function generateLink(node, children) {
    return <Link to={node.attribs.href}>{children}</Link>
  }
}, {
  // bind placeholders
  shouldProcessNode: node => node.name && node.name === 'span' &&
    node.attribs.class === 'ql-placeholder-content',
  processNode: function insertPlaceholder(node) {
    const content = bindings[node.attribs['data-id']] || '{{missing}}'
    return <span>{content}</span>
  }
}, {
  shouldProcessNode: () => true,
  processNode: processNodeDefinitions.processDefaultNode
}]

const mapStateToProps = state => ({
  user: selectors.auth.getUser(state),
  getPage: selectors.page.getOne(state),
  settings: selectors.settings.getSettings(state)
})

const mapDispatchToProps = dispatch => ({
  loadPage: identifier => dispatch(loadPage(identifier))
})

class ContentPage extends Component {
  constructor(props) {
    super(props)
    this.pageType = props.url.slice(1) || 'home'
  }

  componentWillMount() {
    this.props.loadPage(this.pageType)
  }

  render() {
    const page = this.props.getPage(this.pageType)
    if (!page) return null

    return (
      <div className="ql-snow">
        <div
          className="text-left ql-editor"
          style={{margin: '10px'}}
        >
          {htmlToReactParser.parseWithInstructions(
            page.body,
            () => true,
            getProcessingInstructions(this.props.settings)
          )}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage)
