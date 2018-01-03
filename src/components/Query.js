import React, { Component } from 'react'
import { FormGroup, Button, Row, Col } from 'react-bootstrap'
import MdAspectRatio from 'react-icons/lib/md/aspect-ratio'
import { readExample } from '../utils/examples'
import AceEditor from 'react-ace'
import 'brace/mode/sparql'
import 'brace/theme/tomorrow'
import 'brace/ext/language_tools'
import Resizable from 're-resizable'

class Query extends Component {

  state = {
    code: ''
  }

  componentWillReceiveProps(nextProps) {
    this.receiveExampleCode(nextProps.exampleIndex)
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
    }
  }

  onEditorResize = () => {
    this.refs.aceEditor.editor.resize() 
  }

  render() {

    return (
      <form>
        <FormGroup>
          <Resizable
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
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
            />
          </Resizable>
        </FormGroup>
        <Row>
          <Col xs={12} sm={10}>
            <Button
              bsStyle="primary"
              onClick={  () => this.props.onSubmit(this.state.code) }
            >Submit</Button> <span className='grey-text padding-5'>{ this.showStatus() }</span>
          </Col>
          <Col xsHidden sm={2} className='align-right'>
            <MdAspectRatio
              className='aspect-ratio-icon'
              onClick={ this.props.onChangeEditorSize }
              size={18} />
          </Col>
        </Row>
      </form>
    )
  }
}

export default Query
