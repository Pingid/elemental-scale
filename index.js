// Environment variables
require('dotenv').config()

// Dependancies
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path')

// Local Files
const State = require('./server/state')

// Arduino data
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

// serve the frontend app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

// Initialise state;
let state = new State();

io.on('connection',  async socket => {
  const port = new SerialPort(process.env.ARDUINO)
  const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
  
  parser.on('data', data => {
    // Update state based on scale data
    state.update(data);

    // Send data to front end
    socket.emit('scales', { measure: state.get('measure'), weight: state.current(), status: state.getStatus() });
  })
});

// Choose the port and start the server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Mixing it up on port ${PORT}`)
})
