const React = require('react');

module.exports = (props) => {
  return (
    <div>
      <h1>Your weight is: {props.weight}</h1>
      { new Array(10).fill(0).map((x, i) => <div style={{ width: '500px', height: '100px', background: `rgba(0, 0, 0, ${ i / 10})`}}></div>) }
    </div>
  )
}
