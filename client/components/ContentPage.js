import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Parser, ProcessNodeDefinitions} from 'html-to-react'

import selectors from '../store/selectors'
import {loadPage} from '../modules/page/reducer'

const htmlToReactParser = new Parser()
const processNodeDefinitions = new ProcessNodeDefinitions(React)

const processingInstructions = [{
  // convert internal links to Link components
  shouldProcessNode: node => node.name && node.name === 'a' &&
    node.attribs.href.startsWith('/'),
  processNode: function generateLink(node, children) {
    return React.createElement(Link, {to: node.attribs.href}, children)
  }
}, {
  shouldProcessNode: () => true,
  processNode: processNodeDefinitions.processDefaultNode
}]

const mapStateToProps = state => ({
  user: selectors.user.getUser(state),
  getPage: selectors.page.getOne(state)
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
      <div
        className="text-left"
        style={{margin: '10px'}}
      >
        {htmlToReactParser.parseWithInstructions(page.body, () => true, processingInstructions)}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage)
