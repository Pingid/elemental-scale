const safePr = f => new Promise((resolve, reject) => {
  let res;
  try { res = f() }
  catch (err) { reject(err) }
  return resolve(res);
})

module.exports = { safePr };
