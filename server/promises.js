const R = require('ramda');
const fs = require('fs');

const updateFile = async (update, file) => {
  if (!fs.existsSync(file)) { fs.writeFileSync(file, '[]', 'utf8'); }
  const current = JSON.parse(fs.readFileSync(file, 'utf8'));
  const updated = update(current);
  fs.writeFileSync(file, JSON.stringify(updated), 'utf8')
  return updated;
}

const tryCatch = (f) => new Promise(async (resolve, reject) => {
  let res;
  try { res = await f() }
  catch(error) { reject(error) }
  resolve(res);
})

// Retries promise failu  re
const retry = (limit = 0, delay = 0, acc = 0) => (f) => f(acc)
  .catch(x => {
    if (acc >= limit) return f(acc);
    return new Promise((resolve, reject) => setTimeout(resolve, delay))
      .then(x => retry(limit, delay, acc + 1)(f))
  })

// Timeout Promise wrapper
const timeout = (ms, rej) => (promise) => {
  let timeoutProm = new Promise((_resolve, reject) => { 
    let id = setTimeout(() => { 
      clearTimeout(id);
      reject(rej ? rej : 'Timed out in '+ ms + 'ms.') 
    }, ms) 
  })
  return Promise.race([ promise, timeoutProm ])
}

module.exports = { tryCatch, retry, timeout, updateFile }