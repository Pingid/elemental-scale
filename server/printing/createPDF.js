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
    Template = require('../../client/src/template/template.js')({ weight });
    html = ReactDOMServer.renderToStaticMarkup(Template);
  } catch (err) { console.log("EERRROOOR", err); reject(err) }

  pdf.create(html).toBuffer(function(err, buffer){
    if (err) return reject(err);
    return resolve(buffer);
  });
})
