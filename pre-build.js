const fs = require('fs');
const { exec } = require('child_process');

exec('ls /dev/tty.*', (err, stdout, stderr) => {
  const arduinoName = stdout.split('\n').filter(x => /usbmodem/.test(x))[0];
  console.log('serial port ' + arduinoName)
  fs.writeFileSync('./.env', `ARDUINO=${arduinoName}`)
})
