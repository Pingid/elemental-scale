const React = require('react');
const elements = require('../utils/elements');
const { BigNumber } = require('bignumber.js');
const { Helmet } = require('react-helmet');

// require('../index.css');
// require('basscss/css/basscss.css');

module.exports = ({ weight }) => {

  const avog = new BigNumber(6.02e23);
  const getInfo = (elem) => {
    const humanMass = weight / 9.81;
    const elemMass = elem.human.fraction * humanMass;
    const elemMoles = elemMass / elem.atomic_mass;
    const atoms = avog.times(elemMass).toFormat()
    const price = elem.cost.price_avarage * elemMass
    return { name: elem.name, atoms, price }
  }
  const width = 580;

  const cost = Math.round(elements.map(getInfo).reduce((a, b) => a + b.price, 0));
  return (
    <html style={{ margin: 0}}>
      <head>
        <title>Elemental Scale</title>
        <link href="https://unpkg.com/basscss@8.0.2/css/basscss.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500,700" rel="stylesheet" />
      </head>
      <body style={{
        margin: 0,
        width,
        fontFamily: 'Roboto Mono',
        fontSize: 20,
        // backgroundColor: 'grey'
      }}>
        <div style={{ width: width * .94, margin: '0 auto' }}>
          <h2 className="center py3">The Elemental Scale</h2>
          <p className="center py3 px2">99.9% of a human’s body mass is made of 11 elements. The remaining 0.01% are trace elements.</p>
          <p className="center py3 px2">These results show the approximate number of atoms of each element in your body.</p>
          <div className="my4 py3 flex items-center justify-center flex-wrap" style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
            <div style={{ width: width * .4 }}>
              <p className="">Weight: {weight}N</p>
            </div>
          </div>
          <p className="center py2">N = Newton</p>
          <p className="center py2">1 (kg) in mass = 9.81 (N)</p>
          <p className="center py2">The newton (symbol: N) is the International System of Units (SI) derived unit of force. It is named after Isaac Newton. The weight of an object is the force of gravity on the object and may be defined as the mass times the acceleration of gravity.</p>
          <p className="center py2">w = mg</p>
          <p className="center py2">Objects that weigh one Newton on the Earth’s surface include a quarter-pound burger, a stick of margarine, and coincidentally a medium size apple, given the alleged story of how Newton discovered gravity.</p>
          <div className="py3 mt4 mb2" style={{ borderTop: '1px solid black', width: '100%' }} />
          <p className="center py2 pb2 bold">Atoms in your body</p>
          <p className="bold py2 underline">Main Elements</p>
          {
            elements.map(getInfo).sort((a, b) => b.atoms.length - a.atoms.length).map((x, i) => {

              return (
                <React.Fragment key={i}>
                  { i === 11 && <p className="bold py2 underline">Trace Elements</p>}
                  <div className="pb1">

                    <div className="flex items-center justify-between">
                      <p className="bold py0 m0">{x.name}</p><p className="py0 m0 atoms">{x.atoms}</p>
                    </div>
                  </div>
                </React.Fragment>
              )
            })
          }
          <div className="mt4 mb2" style={{ borderTop: '1px solid black', width: '100%' }} />
          <p className="center py2">Estimated value of the raw materials in your body.</p>
          <p className="center bold">${cost}</p>
        </div>
      </body>
    </html>
  )
}
