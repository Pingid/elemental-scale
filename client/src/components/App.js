import React, { Component } from 'react';
import rp from 'request-promise';

import Template from './template';

class App extends Component {
  constructor() {
    super();
    this.state = { weight: 588.40, name: 'Dan Beaven', printStatus: 'done' };

    this.handlePrint = this.handlePrint.bind(this)
  }
  handlePrint() {
    this.setState({ printStatus: 'printing' })
    rp({
      uri: 'http://localhost:3000/print',
      method: 'POST',
      form: { weight: this.state.weight, name: this.state.name }
    })
      .catch(x => this.setState({ printStatus: 'error' }))
      .then(x => this.setState({ printStatus: 'done' }))
  }
  render() {
    return (
      <div className="App">
        <h1>{this.state.printStatus}</h1>
        <div>
          <input type="text" onChange={e => this.setState({ weight: e.target.value })} value={this.state.weight} placeholder="weight" />
          <input type="text" onChange={e => this.setState({ name: e.target.value })} value={this.state.name} placeholder="name" />
          <button onClick={this.handlePrint}>PRINT</button>
        </div>
        <Template weight={this.state.weight} name={this.state.name}/>
      </div>
    );
  }
}

export default App;
