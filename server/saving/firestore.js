const admin = require('firebase-admin');

var serviceAccount = require('./elemental-scale.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();
const devRef = db.collection('visitors').doc('science-museum-april-2019');

module.exports = (weight) => devRef.update({
    weights: admin.firestore.FieldValue.arrayUnion({ weight, time: new Date().toISOString() })
})