const fs = require('fs');
const path = require('path');
const printer = require('printer');
const { BigNumber } = require('bignumber.js');

const humanElements = JSON.parse(fs.readFileSync(path.join(__dirname, './data/humanElements.json')));
const periodicTable = JSON.parse(fs.readFileSync(path.join(__dirname, './data/periodicTable.json')));

const convertToNumber = num => {
  if (typeof num === 'number') return num;
  const [n, ten, power] = num.match(/(^.*[^×])×(.[^−])−(.*)/).slice(1, 4);
  return new BigNumber(`${n}e-${power}`);
}

const getName = elem => {
  if (elem.Element == 'Caesium') return 'Cesium'
  if (elem.Element == 'Iron*') return 'Iron'
  return elem.Element
}

// console.log(humanElements.map(x => console.log(x/['Fraction of mass'] ? x['Element'] : x)))
const combined = humanElements
  .filter(x => x['Fraction of mass'])
  .map(hm => {
    console.log(hm.Element)
    const main = periodicTable.filter(x => x.name === getName(hm))[0]
    const human = {
      fraction: convertToNumber(hm['Fraction of mass']),
      essential: hm['Essential in humans'].replace(/\[.*?\]/gi, ''),
      overdoseEffects: hm['Negative effects of excess'].replace(/\[.*?\]/gi, '')
    }
    return Object.assign({}, main, { human });
})

fs.writeFileSync('./elements.json', JSON.stringify(combined, null, 2))

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
