const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

const createPDF = require('./printing/createPDF')
const print = require('./printing/print')

// Create the server
const app = express()

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))

const plog = str => x => { console.log(str); return x };

// Print
app.post('/print', async (req, res) => {
  const { weight, name, template } = req.body;

  console.log('creating pdf')
  return createPDF(weight, name)
    .then(plog('printing'))
    .then(print)
    .then(done => res.send({ done: true }))
    .catch(err => res.send({ done: false, err }))
})

// Anything that doesn't match the above, send back the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

// Choose the port and start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Mixing it up on port ${PORT}`)
})
