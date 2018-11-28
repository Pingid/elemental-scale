const React = require('react');
const elements = require('../utils/elements');
const { BigNumber } = require('bignumber.js');
// 6.023 × 10^23 = 12.046 × 10^23

module.exports = ({ weight, name }) => {

  const avog = new BigNumber(6.02e23);
  const getInfo = (elem) => {
    const humanMass = weight / 9.81;
    const elemMass = elem.human.fraction * humanMass;
    const elemMoles = elemMass / elem.atomic_mass;
    const atoms = avog.times(elemMass).toFixed();
    console.log({elem, elemMass,elemMoles, atoms})
    return { name: elem.name, atoms }
  }
  console.log(getInfo(elements[6]))

  return (
    <div>
      <h1>Your weight is: {weight}</h1>
      {
        elements.map(getInfo).map((x, i) => (
          <div key={i}>
            <h3>{x.name}</h3>
            <p>{x.atoms}</p>
          </div>
        ))

      }
    </div>
  )
}
