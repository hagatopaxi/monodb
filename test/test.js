const monolite = require('../');

const db = new monolite('test_database');

db.createCollection('Personne');
db.createCollection('Voiture');