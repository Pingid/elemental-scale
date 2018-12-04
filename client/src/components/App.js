import React, { Component } from 'react';
import rp from 'request-promise';
import { Howl } from 'howler';
import io from 'socket.io-client';
import { BigNumber } from 'bignumber.js';

import Loader from './Loader';
import Template from './template';

// Set up websocket
const socket = io.connect('http://localhost:3000');

const statusMessages = {
  calibrating: 'Wait while we calibrate the scales',
  readyToWeigh: 'Please stand on the scales',
  measured: 'Please step off the scales',
  scalesReset: 'Wait while we perform some calculations',
  printing: 'Printing your recipt'
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      weight: '',
      lastWeight: '',
      name: 'Dan Beaven',
      status: 'calibrating',
      printing: false
    };

    this.handlePrint = this.handlePrint.bind(this)
  }
  componentDidMount() {

    // Subscribe to websocket events
    socket.on('weight', data => {
      const { weight, lastWeight, status, printing } = this.state;

      // If status is after print just escape
      if (status === 'scalesReset' || status === 'printing') return null;

      // If they step off the scales after measurement
      if (status === 'measured' && data.data < 90) return this.setState({ status: 'scalesReset' });

      // When value is stable and high
      if (lastWeight > 90 && weight > 90 && Math.abs(weight - lastWeight) < .1 && status === 'readyToWeigh') {
        this.state.status = 'measured';
        return this.handlePrint();
      }

      // If data is not yet a number set message to calibrating
      if (typeof data.data === 'object') return this.setState({ status: 'calibrating' })
      if (typeof data.data === 'number' && status === 'calibrating') return this.setState({ status: 'readyToWeigh' });
      if (Math.abs(data.data - lastWeight) > .001 && status === 'readyToWeigh') return this.setState({ weight: data.data, lastWeight: weight })
    });

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
  }
  handlePrint() {
    if (this.state.printing) return null;
    this.state.printing = true;
    console.log('Print')
    // Update print status
    this.setState({ status: 'measured', printing: true })

    // Play sound
    this.sound.seek(this.sound.duration() * Math.random())
    this.sound.play()

    socket.emit('print', this.state.weight)
    socket.on('print', data => {
      this.sound.stop()
      this.setState({ status: 'printing' });
      setTimeout(() => this.setState({ printing: false, weight: '', status: 'calibrating' }), 6000)
    })
    // Call printing endpoint with weight
    // rp({
    //   uri: 'http://localhost:3000/print',
    //   method: 'POST',
    //   form: { weight: this.state.weight }
    // })
    //   .catch(x => {
    //     this.sound.stop()
    //     this.setState({ printing: false, status: 'calibrating' })
    //   })
    //   .then(x => {
    //     this.sound.stop()
    //     this.setState({ status: 'printing' });
    //     setTimeout(() => this.setState({ printing: false, weight: '', status: 'calibrating' }), 6000)
    //   })
  }
  render() {
    const { weight, status } = this.state;
    console.log(weight, status)
    return (
      <div className="App">
          <div style={{ width: '100vw', height: '100vh' }} className="flex items-center justify-center">
            <div style={{ width: '50rem', transition: '.3s' }}>
              <h1>{statusMessages[status]}</h1>
              <div className="pb2 flex items-center justify-between">
                <h3>Weight (N): {weight}</h3>
              </div>
            </div>

          </div>
          <button onMouseOver={() => console.log(this.handlePrint)}>fdsa</button>
          {
            // <div style={{ width: '100%' }} className="flex items-center justify-center">
            //   <div><Template weight={this.state.weight} name={this.state.name}/></div>
            // </div>
          }
      </div>
    );
  }
}

export default App;
