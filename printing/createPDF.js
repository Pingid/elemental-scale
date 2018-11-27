const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const ReactDOMServer = require('react-dom/server');

// Transform React JSX
require("@babel/register")({
  plugins: ["transform-react-jsx"]
});

module.exports = (weight) => new Promise((resolve, reject) => {
  const Template = require('./template.jsx')({ weight, title: "HELLO" });
  const html = ReactDOMServer.renderToStaticMarkup(Template);
  pdf.create(html).toBuffer(function(err, buffer){
    resolve(buffer)
  });
})
