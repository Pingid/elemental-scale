const renderInputs = () => {
  let child = document.createElement('div');

  let str = `
    <div>
      <label>Enter your weight in kg</label>
      <input id="weight" type="text" placeholder="weight"></input>
      <button id="enter">enter</button>
    </div>
  `;
  child.innerHTML = str;
  // child = child.firstChild;
  document.body.appendChild(child);
  return true;
  // return new Promise((resolve, reject) => {
  //   document.getElementById('enter').onclick = (e) => {
  //     resolve(document.getElementById('weight').value)
  //   }
  // })

}

module.exports = renderInputs;
