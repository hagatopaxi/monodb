'use strict';

var mocha = require('gulp-mocha');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var exec = {
    /**
     * Lance le server avec nodemon qui relance le server à chaque modification de fichier
     * @param  {string} args nom du fichier racine du server
     */
    runserver: function(args) {
        let serverPath = args[0] || './index.js';
        nodemon({
            script: serverPath
        });
    },
    /**
     * Lance la suite de test avec mocha
     * @param {array} args liste des modules ou des chemins absolus des fichiers à tester
     */
    test: function(args) {
        let testPaths = [];
        if (!args.length) {
            testPaths.push('./*/test/test*.js');
        } else {
            for (var i = 0; i < args.length; i++) {
                if (args[i].slice(args[i].length - 3) === '.js') {
                    testPaths.push(args[i]);
                } else {
                    testPaths.push(args[i] + '/test/test*.js');
                }
            }
        }
        gulp.src(testPaths, {
                read: false
            })
            .pipe(mocha({
                exit: true,
                timeout: 10000
            }));
    },
    /**
     * Permet de remplir la base de donnée des valeurs contenus dans seed.js
     * @param {array}  args list des collections à populate dans la bd
     */
    populate: function(args) {
        let seed = require('./seed.js');
        let mongoClient = require('mongodb').MongoClient;
        let mongoConfig = require('./config/mongo.json');

        let collections;

        if (args.length !== 0) {
            collections = args;
        } else {
            collections = Object.keys(seed.base);
        }

        mongoClient.connect(mongoConfig.URL_MONGO, function(error, mongoMgr) {
            if (error) throw error;

            for (let i = 0; i < collections.length; i++) {
                var collection = collections[i];
                var db = mongoMgr.db(mongoConfig.DATABASE_NAME);
                db.collection(collection).deleteMany({});
                db.collection(collection).insertMany(seed.base[collection], function(collection, error) {
                    if (error) throw error;
                    console.log(`INSERT ALL : ${collection}`);
                }.bind(null, collection));
            }

            mongoMgr.close();
        });
    },
    /**
     * Affiche la liste des erreurs d'écritures dans les scripts
     * @param  {[type]} args [description]
     * @return {[type]}      [description]
     */
    lint: function() {
        gulp.src(['./*/test/test*.js', './*.js', './*/*.js']).pipe(jshint({
            node: true,
            mocha: true,
            esversion: 6,
            unused: true,
            devel: true
        })).pipe(jshint.reporter('default'));
    }
};

var cmd = process.argv[2];
var args = process.argv.slice(3);
exec[cmd](args);