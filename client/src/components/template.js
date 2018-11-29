const React = require('react');
const elements = require('../utils/elements');
const { BigNumber } = require('bignumber.js');
const { Helmet } = require('react-helmet');

module.exports = ({ weight, name }) => {

  const avog = new BigNumber(6.02e23);
  const getInfo = (elem) => {
    const humanMass = weight / 9.81;
    const elemMass = elem.human.fraction * humanMass;
    const elemMoles = elemMass / elem.atomic_mass;
    const atoms = avog.times(elemMass).toFixed().replace(/\..*/, '');
    // console.log({ name: elem.name, elem })
    return { name: elem.name, atoms }
  }
  const width = 580;
  // console.log(elements.sort((a, b) => b.atoms.length - a.atoms.length))
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
          <div className="my3 flex items-center justify-center flex-wrap" style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
            <div style={{ width: width * .4 }}>
              <p className="">Name: {name}</p>
              <p className="">Weight: {weight}N</p>
            </div>
          </div>
          <p className="center py2">N = Newton</p>
          <p className="center py2">1 (kg) in mass = 9.81 (N)</p>
          <p className="center py2">The newton (symbol: N) is the International System of Units (SI) derived unit of force. It is named after Isaac Newton. The weight of an object is the force of gravity on the object and may be defined as the mass times the acceleration of gravity.</p>
          <p className="center py2">w = mg</p>
          <p className="center py2">Objects that weigh one Newton on the Earth’s surface include a quarter-pound burger, a stick of margarine, and coincidentally a medium size apple, given the alleged story of how Newton discovered gravity.</p>
          <div className="py2" style={{ borderTop: '1px solid black', width: '100%' }} />
          <p className="center py2 pb2 bold">Atoms in your body</p>
          <p className="bold py2">Main Elements</p>
          {
            elements.map(getInfo).sort((a, b) => b.atoms.length - a.atoms.length).map((x, i) => {

              return (
                <React.Fragment key={i}>
                  { i === 11 && <p className="bold py2">Trace Elements</p>}
                  <div className="pb2">
                    <p className="bold py0 m0">{x.name}</p>
                    <div className="pt1 flex items-center justify-between">
                      <p className="py0 m0">{x.atoms}</p><p className="py0 m0">atoms</p>
                    </div>
                  </div>
                </React.Fragment>
              )
            })

          }
        </div>
      </body>
    </html>
  )
}
