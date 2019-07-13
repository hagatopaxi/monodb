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
    }
};

var cmd = process.argv[2];
var args = process.argv.slice(3);
exec[cmd](args);