const fs = require('fs');
const path = require('path');
const printer = require('printer');

module.exports = file => new Promise((resolve, reject) => {
  const fileBuffer = fs.readFileSync(path.join(__dirname, file));
  printer.printDirect({
      data: fileBuffer,
      type: 'PDF',
      printer: 'Star_TSP143__STR_T_001_',
      success: id => resolve(id),
      error: err => reject(err)
  })
})
