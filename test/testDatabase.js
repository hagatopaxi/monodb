"use strict";

const monolite = require('../');
const mocha = require('mocha');
const exec = require('child_process').exec;
const assert = require('assert');
const fs = require('fs');

describe('Database', function() {
    describe('open', function() {
        /**
         * Create folder if does not exist.
         * Else open it and read all others folder inside and create associate collections
         */

        // beforeEach(function(done) {
        //     exec('rm -Rf mldb');
        //     exec('rm -f test.json');
        //     exec('rm -Rf test.json');
        //     done();
        // });
        //
        // afterEach(function(done) {
        //     exec('rm -Rf mldb');
        //     exec('rm -f test.json');
        //     exec('rm -Rf test.json');
        //     done();
        // });

        // it('database does not exist', function(done) {
        //     let db_name = __dirname + '/mldb';
        //     let db = new monolite(db_name);
        //
        //     fs.access(db_name, function(err) {
        //         fs.rmdir(db_name, function(err) {
        //             done(err);
        //         });
        //     });
        // });

        it('database exist', function(done) {
            let db_name = 'db_name';
            createDatabaseFolder(db_name, function(err) {
                console.log(err);
                assert(!err);

                let db = new monolite(db_name);

                assert(db.status);
                console.log(db);
                assert(db.collection1);
                assert(db.collection2);
                assert(db.collection3);

                deleteFolderRec(db_name, function(err) {
                    assert(!err);
                    done();
                });
            });
        });

        // it('path is file, not a folder', function(done) {
        //     let file_path = __dirname + 'fakedb.json';
        //     fs.writeFile(file_path, 'I am Fake DB', 'utf-8', function(err) {
        //         try {
        //             let db = new monolite(file_path);
        //         } catch (err) {
        //             fs.unlink(file_path, done);
        //             return;
        //         }
        //         assert.fail();
        //     });
        // });
    });

    describe('createCollection', function() {
        it('crete collection simply'
            // , function(done) {
            //     let db_name = 'db_name';
            //     createDatabaseFolder(db_name, function() {
            //         done();
            //     });
            // }
        );
    });

    describe('compress', function() {

    });

    describe('depress', function() {

    });
});

function createDatabaseFolder(db_name, cb) {
    db_name = __dirname + '/' + db_name;
    let col1_name = '/collection1';
    let col2_name = '/collection2';
    let col3_name = '/collection3';
    fs.mkdir(db_name, function(err1) {
        assert(!err1)
        fs.mkdir(db_name + col1_name, function(err2) {
            assert(!err2)
            fs.mkdir(db_name + col2_name, function(err3) {
                assert(!err3)
                fs.mkdir(db_name + col3_name, function(err4) {
                    assert(!err4)
                    cb(err1 || err2 || err3 || err4);
                });
            });
        });
    });
}

function deleteFolderRec(root, cb) {
    exec('rm -Rf ' + __dirname + '/' + root);
    cb();
}