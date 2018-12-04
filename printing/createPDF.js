const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const ReactDOMServer = require('react-dom/server');

// Transform React JSX
require("@babel/register")({
  plugins: ["transform-react-jsx"]
});

module.exports = (weight) => new Promise((resolve, reject) => {
  let Template;
  let html;
  try {
    Template = require('../client/src/components/template.js')({ weight });
    html = ReactDOMServer.renderToStaticMarkup(Template);
  } catch (err) { reject(err) }
  // fs.writeFileSync('./template.html', html);

  // pdf.create(html).toFile('./template.pdf', function(err, res) {
  //   if (err) return console.log(err);
  //   console.log(res); // { filename: '/app/businesscard.pdf' }
  // });
  pdf.create(html).toBuffer(function(err, buffer){
    if (err) return reject(err);
    return resolve(buffer);
  });
})
