const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { BigNumber } = require('bignumber.js');
require('dotenv').config()

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

const createPDF = require('./printing/createPDF')
const print = require('./printing/print')

// server.listen(5000); // WARNING: app.listen(80) will NOT work here!
const port = new SerialPort(process.env.ARDUINO)
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Anything that doesn't match the above, send back the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

class State {
  constructor() {
    this.state = {
      weights: new Array(10).fill(0),
      scalesState: 'calibrating',
      printState: 'done',
      measure: 0
    };

    this.weights = new Array(10).fill(0);
    this.scalesState = 'calibrating';
    this.printState = 'done';
    this.measure = 0;
  }
  addWeight(n) { this.set({ weights: [].concat(this.get('weights'), [n]).slice(1, this.get('weights').length + 1) }) }

  current() { return this.get('weights')[this.get('weights').length - 1] }
  prev() { return this.get('weights')[this.get('weights').length - 2] }
  average(n) { return this.get('weights').slice(this.get('weights').length - n, this.get('weights').length).reduce((a, b) => a + b) / n }

  set(obj) { this.state = Object.assign({}, this.state, obj) }
  get(key) { return this.state[key] }

  getStatus() { return { scales: this.get('scalesState'), print: this.get('printState') } }

  async print(value) {
    if (this.printState !== 'done') return null;
    this.set({ measure: value, printState: 'calculating' })
    const printBuffer = await createPDF(value);
    this.set({ printState: 'printing' })
    // const printed = await print(printBuffer)
    //   .catch(err => { this.printState = 'error'; console.log('Error Printing', err); })
    await new Promise((resolve, reject) => setTimeout(() => { resolve() }, 6000))
    this.set({ measure: 0, printState: 'done' })
  }
}

io.on('connection', function (socket) {
  let state = new State();

  parser.on('data', data => {
    // Convert string mass kg to number nutons
    const convetToNutons = new BigNumber(data.replace(/Load_cell\soutput\sval:/, '')).times(9.81).toNumber();
    state.addWeight(convetToNutons)

    // If no reading
    if (isNaN(convetToNutons)) { state.set({ scalesState: 'calibrating'}) };

    // if there is no weight on the scales
    if (state.current() < .5) { state.set({ scalesState: 'ready'}) };

    // if there is weight on the scales
    if (state.current() > .5) {
      if (Math.abs(state.current() - state.average(5)) < .1) { state.set({ scalesState: 'measured'}) }
      else if (Math.abs(state.current() - state.prev()) < 1) { state.set({ scalesState: 'measuring'}) }
      else if (state.current() > state.prev()) { state.set({ scalesState: 'weighing'})  }
      else { state.set({ scalesState: 'calibrating'}) }
    }

    // Print if measured
    if (state.get('scalesState') === 'measured' && state.get('printState') === 'done') { state.print(state.current()) }

    // Send data to front end
    socket.emit('scales', { measure: state.get('measure'), weight: state.current(), status: state.getStatus() });
  })
});

// Choose the port and start the server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Mixing it up on port ${PORT}`)
})
