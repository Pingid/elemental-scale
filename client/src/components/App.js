import React, { Component } from 'react';
import { Howl } from 'howler';
import io from 'socket.io-client';

import Typewriter from './Typewriter';
import Loader from './Loader';
import Template from './template';

// Set up websocket
const socket = io.connect('http://localhost:3000');

const statusMessages = {
  connecting: 'Waiting for connection',
  calibrating: 'calibrating scales',
  ready: 'stand on the scales',
  weighing: 'reading weight',
  measuring: 'averaging',
  measured: 'step off',
  calculating: 'calculating...',
  printing: 'Printing...'
}

const isOne = (x, arr)  => arr.filter(y => x === y).length > 0;

class App extends Component {
  constructor() {
    super();
    this.state = {
      weight: '',
      status: '',
      measure: 0,
      connected: false
    };
  }
  componentDidMount() {
    // Load sounds file
    this.sound = new Howl({
      src: ['sounds.mp3'],
      autoplay: false,
      loop: true,
      volume: 0.5,
      onend: function() {
        console.log('Finished!');
      }
    });

    socket.on('connect', () => {
      this.setState({ connected: true })
      socket.on('disconnect', () => this.setState({ connected: false }));
    });
    socket.on('scales', data => {
      console.log(data)
      this.setState({ measure: data.measure, weight: data.weight, status: this.getStatus(data.status) })
    })

  }
  getStatus({ print, scales }) {
    if (print === 'done') return scales;
    if (print === 'calculating' && (scales === 'measuring' || scales === 'measured')) return 'measured'
    return print
  }
  render() {
    const { weight, status, connected, measure } = this.state;
    return (
      <div className="App">
          <div style={{ width: '100vw', height: '100vh' }} className="flex items-center justify-center">
            {!connected && <h1>{statusMessages.connecting}</h1>}
            {connected && (
              <div style={{ width: '50rem', transition: '.3s' }}>
                <h1><Typewriter interval={150}>{statusMessages[status]}</Typewriter></h1>
                <div className="pb2 flex items-center justify-between">
                  { isOne(status, ['ready', 'weighing', 'measuring']) && <p>Weight (N): {weight}</p> }
                  { isOne(status, ['measured', 'calculating']) && <p>Your weight is {measure} N</p> }
                </div>
              </div>
            )}
          </div>
          {
            // <div style={{ width: '100%' }} className="flex items-center justify-center">
            //   <div><Template weight={weight} /></div>
            // </div>
          }
      </div>
    );
  }
}

export default App;
