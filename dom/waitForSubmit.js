module.exports = () => new Promise((resolve, reject) => {
  document.getElementById('enter').onclick = (e) => {
    let elem = document.getElementById('weight');
    const value = elem.value;
    elem.value = '';
    resolve(value)
  }
})
