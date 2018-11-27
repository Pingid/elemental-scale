const fs = require('fs');
const path = require('path');
const printer = require('printer');

module.exports = file => new Promise((resolve, reject) => {
  const fileBuffer = fs.readFileSync(path.join(__dirname, file));
  printer.printDirect({
      data: fileBuffer,
      type: 'PDF',
      success: function(id) {
          resolve()
      },
      error: function(err) {
          reject(err)
      }
  })
})
