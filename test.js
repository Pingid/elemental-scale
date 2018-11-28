const fs = require('fs');
const path = require('path');
const printer = require('printer');
const { BigNumber } = require('bignumber.js');

const elements = require('./client/src/utils/elements');
const periodicTable = require('./client/src/utils/periodic-table');

const convertTinyNumberString = str => {
  const [n, ten, power] = str.match(/(^.*[^×])×(.[^−])−(.*)/).slice(1, 4)
  return new BigNumber(`${n}e-${power}`);
}

const newelem = elements.filter(y => y.human.fraction).map(x => {
  if (typeof x.human.fraction === 'string') {
    const human = Object.assign({}, x.human, { fraction: convertTinyNumberString(x.human.fraction)});
    return Object.assign(x, { human });
  }
  return x;
})

fs.writeFileSync('./elements.json', JSON.stringify(newelem, null, 2))

// console.log(elements, periodicTable)
// module.exports = file => new Promise((resolve, reject) => {
//   const fileBuffer = fs.readFileSync(path.join(__dirname, file));
//   printer.printDirect({
//       data: fileBuffer,
//       type: 'PDF',
//       success: function(id) {
//           resolve()
//       },
//       error: function(err) {
//           reject(err)
//       }
//   })
// })
