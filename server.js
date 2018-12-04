const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { BigNumber } = require('bignumber.js');

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

const createPDF = require('./printing/createPDF')
const print = require('./printing/print')

// server.listen(5000); // WARNING: app.listen(80) will NOT work here!
const port = new SerialPort('/dev/tty.usbmodem1421')
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Anything that doesn't match the above, send back the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

io.on('connection', function (socket) {
  let lastWeight = 0;
  parser.on('data', data => {
    const convetToNutons = new BigNumber(data.replace(/Load_cell\soutput\sval:/, '')).times(9.81).toNumber();

    const getStatus = () => {
      if (isNaN(convetToNutons)) return 'calibrating';
      if (lastWeight < 10 && convetToNutons < 10 && Math.abs(lastWeight - convetToNutons) < .5) return 'ready'
      if (lastWeight > 90 && convetToNutons > 90 && Math.abs(lastWeight - convetToNutons) < .5) return 'standing'
      lastWeight = convetToNutons;
      return 'calculating'
    }

    socket.emit('weight', { weight: convetToNutons, status: getStatus() });
  })

  let printing = false;
  socket.on('print', data => {
    if (printing) return null;
    printing = true;

    return createPDF(data)
      .then(print)
      .then(done => {
        printing = false;
        socket.emit('print', { done: true })
      })
      .catch(err => {
        printing = false;
        socket.emit('print', { done: true })
      })
  })
});

// Choose the port and start the server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Mixing it up on port ${PORT}`)
})
