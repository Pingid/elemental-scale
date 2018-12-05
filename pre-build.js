const fs = require('fs');
const { exec } = require('child_process');

exec('ls /dev/tty.*', (err, stdout, stderr) => {
  const arduinoName = stdout.split('\n').filter(x => /usbmodem/.test(x))[0];
  fs.writeFileSync('./.env', `ARDUINO=${arduinoName}`)
})
