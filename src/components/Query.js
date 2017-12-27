import React, { Component } from 'react';
import { FormGroup, Button, Row, Col } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/mode/sparql/sparql';
import MdAspectRatio from 'react-icons/lib/md/aspect-ratio';

class Query extends Component {

  state = {
    code: ''
  }

  updateCode = (newCode) => {
    this.setState({
      code: newCode
    })
  }

  showStatus = () => {
    if (this.props.status === "waiting") {
      return "Querying..."
    } else if (this.props.status === "done") {
      return `${this.props.numResults} results found!`
    } else if (this.props.status === "error") {
      return "Error encountered while querying!"
    } else if (this.props.status === "empty") {
      return "No result found!"
    }
  }

  render() {
    const codeOptions = {
      lineNumbers: true,
      tabSize: 2
    }

    return (
      <form>
        <FormGroup>
          <CodeMirror
            name="query"
            value={this.state.code}
            onChange={this.updateCode}
            defaultValue="# Enter a Wikidata SPARQL query here"
            options={codeOptions} />
        </FormGroup>
        <Row>
          <Col xs={12} sm={10}>
            <Button
              bsStyle="primary"
              onClick={  () => this.props.onSubmit(this.state.code) }
            >Submit</Button> <span class='grey-text padding-5'>{ this.showStatus() }</span>
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
