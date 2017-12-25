import React, { Component } from 'react';
import { FormGroup, FormControl, Button, HelpBlock } from 'react-bootstrap';

class Query extends Component {

  showStatus = () => {
    if (this.props.status === "waiting") {
      return "Waiting..."
    } else if (this.props.status === "done") {
      return "Done!"
    }
  }

  render() {
    return (
      <form onSubmit={ this.props.onSubmit }>
        <FormGroup>
          <FormControl
            componentClass="textarea"
            name="query"
            placeholder="Enter a Wikidata SPARQL query here"
            rows="12"
          />
        </FormGroup>
        <Button
          bsStyle="primary"
          type="submit"
        >Submit Query</Button>
        <HelpBlock>{ this.showStatus() }</HelpBlock>
      </form>
    )
  }
}

export default Query
