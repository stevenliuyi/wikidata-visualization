import React, { Component } from 'react';
import { FormGroup, Button, HelpBlock } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/mode/sparql/sparql';

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
      return "Waiting..."
    } else if (this.props.status === "done") {
      return "Done!"
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
        <Button
          bsStyle="primary"
          onClick={  () => this.props.onSubmit(this.state.code) }
        >Submit Query</Button>
        <HelpBlock>{ this.showStatus() }</HelpBlock>
      </form>
    )
  }
}

export default Query
