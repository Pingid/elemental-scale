const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/tty.usbmodem1421')

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
// parser.on('data',data => {
//   console.log(new BigNumber(data.replace(/Load_cell\soutput\sval:/, '')).toString())
// })

module.exports = parser;
