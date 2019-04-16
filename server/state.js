const { BigNumber } = require('bignumber.js');
const createPDF = require('./printing/createPDF')
const print = require('./printing/print')

class State {
  constructor() {
    this.state = {
      weights: new Array(10).fill(0),
      scalesState: 'calibrating',
      printState: 'done',
      measure: 0
    };
  }
  addWeight(n) { this.set({ weights: [].concat(this.get('weights'), [n]).slice(1, this.get('weights').length + 1) }) }

  current() { return this.get('weights')[this.get('weights').length - 1] }
  prev() { return this.get('weights')[this.get('weights').length - 2] }
  average(n) { return this.get('weights').slice(this.get('weights').length - n, this.get('weights').length).reduce((a, b) => a + b) / n }

  set(obj) { this.state = Object.assign({}, this.state, obj) }
  get(key) { return this.state[key] }

  getStatus() { return { scales: this.get('scalesState'), print: this.get('printState') } }

  async print(value) {
    if (this.get('printState') !== 'done') return null;
    this.set({ measure: value, printState: 'calculating' })
    const printBuffer = await createPDF(value);
    this.set({ printState: 'printing' })  
    const printed = await print(printBuffer)
      .catch(err => { this.printState = 'error'; console.log('Error Printing', err); })
    await new Promise((resolve, reject) => setTimeout(() => { resolve() }, 6000))
    this.set({ measure: 0, printState: 'done' })
  }

  update(data) {
    // Convert string mass kg to number nutons
    const convertedToNutons = new BigNumber(data.replace(/Load_cell\soutput\sval:/, '')).times(9.81).toNumber();
    this.addWeight(convertedToNutons)

    // If no reading
    if (isNaN(convertedToNutons)) { this.set({ scalesState: 'calibrating'}) };

    // if there is no weight on the scales
    if (this.current() < 90) { this.set({ scalesState: 'ready'}) };

    // if there is weight on the scales
    if (this.current() > 90) {
      if (Math.abs(this.current() - this.average(5)) < .1) { this.set({ scalesState: 'measured'}) }
      else if (Math.abs(this.current() - this.prev()) < 1) { this.set({ scalesState: 'measuring'}) }
      else if (this.current() > this.prev()) { this.set({ scalesState: 'weighing'})  }
      else { this.set({ scalesState: 'calibrating'}) }
    }

    // Print if measured
    if (this.get('scalesState') === 'measured' && this.get('printState') === 'done') { setTimeout(() => this.print(this.current()), 0) }
  }
}

module.exports = State;
