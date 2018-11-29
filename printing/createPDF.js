const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const ReactDOMServer = require('react-dom/server');

// Transform React JSX
require("@babel/register")({
  plugins: ["transform-react-jsx"]
});

module.exports = (weight, name) => new Promise((resolve, reject) => {
  const Template = require('../client/src/components/template.js')({ weight, name });
  const html = ReactDOMServer.renderToStaticMarkup(Template);
  fs.writeFileSync('./template.html', html);

  // pdf.create(html).toFile('./template.pdf', function(err, res) {
  //   if (err) return console.log(err);
  //   console.log(res); // { filename: '/app/businesscard.pdf' }
  // });
  pdf.create(html).toBuffer(function(err, buffer){
    resolve(buffer)

  });
})
