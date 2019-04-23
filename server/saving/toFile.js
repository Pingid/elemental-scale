const { updateFile } = require('../promises.js');

module.exports = (weight) => updateFile(data => ([ ...data, { weight, time: new Date().toISOString() }]), './data/science-museum-april-2019-visitors.json')