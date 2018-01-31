import React, { Component } from 'react'
import { FormGroup, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import MdAspectRatio from 'react-icons/lib/md/aspect-ratio'
import FaClose from 'react-icons/lib/fa/close'
import FaAngleDoubleLeft from 'react-icons/lib/fa/angle-double-left'
import { readExample } from '../utils/examples'
import AceEditor from 'react-ace'
import 'brace/mode/sparql'
import 'brace/theme/tomorrow'
import 'brace/ext/language_tools'
import Resizable from 're-resizable'
import { keywords, snippets } from '../utils/sparql'

class Query extends Component {

  state = {
    code: ''
  }

  componentWillReceiveProps(nextProps) {
    // udpate width
    if (nextProps.width !== this.props.width) {
      this.resizable.setState({ width: nextProps.width }, () => {
        this.onEditorResize()
      })
    }
    this.receiveExampleCode(nextProps.exampleIndex)
  }
  
  myCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
      // disable the Return key as suggestion comfirmation key
      editor.completer.keyboardHandler.commandKeyBinding.return = null

      callback(null, keywords.map((word) => {
        return {
          caption: word,
          value: word,
          meta: 'keyword'
        }
      }))
      callback(null, Object.keys(snippets).map((title) => {
        return {
          caption: title,
          value: snippets[title],
          meta: 'snippets'
        }
      }))
    },
  }

  receiveExampleCode = (index) => {
    if (index >= 0) {
      readExample(index)
        .then( sparql => {
          this.setState({ code: sparql })
        })
    }
  }

  updateCode = (newCode) => {
    this.setState({
      code: newCode
    })
  }

  showStatus = () => {
    if (this.props.status === 'waiting') {
      return 'Querying...'
    } else if (this.props.status === 'done') {
      return `${this.props.numResults} results found!`
    } else if (this.props.status === 'error') {
      return 'Error encountered while querying!'
    } else if (this.props.status === 'empty') {
      return 'No result found!'
    } else if (this.props.status === 'timeout') {
      return 'Query timeout!'
    } else if (this.props.status === 'cancelled') {
      return 'Query is cancelled!'
    }
  }

  onEditorResize = () => {
    if (this.refs.aceEditor != null) this.refs.aceEditor.editor.resize() 
  }

  render() {

    return (
      <form>
        <FormGroup>
          <Resizable
            ref={ c=> { this.resizable = c }}
            defaultSize={{width:'100%', height:300}}
            minHeight='50'
            onResize={this.onEditorResize}
            enable={{top:false,right:false,bottom:true,left:false,topRight:false,bottomRight:false,bottomLeft:false,topLeft:false}}
          >
            <AceEditor
              ref='aceEditor'
              mode='sparql'
              theme='tomorrow'
              height='100%'
              width='100%'
              value={this.state.code}
              fontSize={14}
              showPrintMargin={false}
              tabSize={2}
              onChange={this.updateCode}
              onBeforeLoad={() => this.updateCode('# Enter a Wikidata SPARQL query here')}
              onLoad={(_editor) => {
                // Remove warning message on console:
                // Automatically scrolling cursor into view after selection change this will be disabled in the next version set editor.$blockScrolling = Infinity to disable this message
                _editor.$blockScrolling = Infinity
              }}
              enableBasicAutocompletion={[this.myCompleter]}
              enableLiveAutocompletion={true}
            />
          </Resizable>
        </FormGroup>
        <Row>
          <Col xs={12} sm={9}>
            <Button
              bsStyle="primary"
              onClick={ () => this.props.onSubmit(this.state.code) }
            >Submit</Button>{' '}
            <span className='grey-text padding-5'>{ this.showStatus() }</span>
            {
              this.props.status === 'waiting' &&
                (
                  <OverlayTrigger placement='bottom' overlay={
                    <Tooltip id='cancel-tooltip'>cancel this query</Tooltip>
                  }>
                    <FaClose
                      className='clickable-icon'
                      onClick={ () => this.props.onCancel() } />
                  </OverlayTrigger>
                )
            }
          </Col>
          <Col xsHidden sm={3} className='align-right'>
            { !this.props.editorFullScreen &&
              <FaAngleDoubleLeft
                className='clickable-icon'
                onClick={ () => this.props.onHide() }
                size={18} />
            }
            <MdAspectRatio
              className='clickable-icon'
              onClick={ this.props.onChangeEditorSize }
              size={18} />
          </Col>
        </Row>
      </form>
    )
  }
}

export default Query
