import React, { Component } from 'react';
import rp from 'request-promise';

import Loader from './Loader';
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
      .then(x => this.setState({ printStatus: 'done', name: '', weight: '' }))
  }
  render() {
    const { printStatus } = this.state;
    return (
      <div className="App">
          <div style={{ width: '100vw', height: '100vh' }} className="flex items-center justify-center">
            <div style={{ width: '21rem' }}>
              <div className="pb2 flex items-center justify-between">
                <label className="pr2">Weight (N): </label>
                <input type="text" onChange={e => this.setState({ weight: e.target.value })} value={this.state.weight} placeholder="weight" />
              </div>
              <div className="pb2 flex items-center justify-between">
                <label className="pr2">Name: </label>
                <input type="text" onChange={e => this.setState({ name: e.target.value })} value={this.state.name} placeholder="name" />
              </div>
              { (printStatus === 'done' || printStatus === 'error') && <div className="right p1 mt1" style={{ border: '1px solid black' }} onClick={this.handlePrint}>print</div> }
              { printStatus === 'printing' && <div><div className="right p1 mt1 ml2" style={{ border: '1px solid black' }}>printing</div><Loader /></div> }
            </div>
          </div>
          <div style={{ width: '100%' }} className="flex items-center justify-center">
            <div><Template weight={this.state.weight} name={this.state.name}/></div>
          </div>
      </div>
    );
  }
}

export default App;
