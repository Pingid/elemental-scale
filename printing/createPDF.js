const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit')

module.exports = (weight, output) => new Promise((resolve, reject) => {
  let doc = new PDFDocument
  const stream = doc.pipe(fs.createWriteStream(path.join(__dirname, output)))

  doc.text(`your weight was ${weight}`, 100, 100)
  doc.end()
  stream.on('finish', resolve)
  stream.on('error', reject)
})
