"use strict";

const monolite = require('../');
const mocha = require('mocha');
const exec = require('child_process').exec;
const assert = require('assert');
const fs = require('fs');

describe('Database', function() {
    describe('open', function() {

        afterEach(function(done) {
            exec('rm -Rf mldb');
            exec('rm -f .tmpfile');
            done();
        });

        it('database does not exist', function(done) {
            let db_name = 'mldb';
            let db = new monolite(db_name);

            fs.access(db_name, function(err) {
                done(err);
            });
        });

        it('database is not directory but file', function(done) {
            let file_name = '.tmpfile';
            fs.writeFile(file_name, 'content', function(err, res) {
                if (err) return done(err);

                try {
                    let db = new monolite(file_name);
                } catch (err) {
                    console.log(err);
                    assert(err.code === 'ENOTDIR');
                    fs.unlink(file_name, done);
                }
            });
        });

        it('database is directory but empty', function(done) {
            let dir_name = 'mldb';
            fs.mkdir(dir_name, function(err) {
                if (err) return done(err);

                let db = new monolite(dir_name);

                assert(db.status);
                fs.rmdir(dir_name, done);
            });
        });

        // it('database is directory with some directories', function(done) {
        //     let db_name = 'mldb/';
        //     let col1_name = 'collection1';
        //     let col2_name = 'collection2';
        //     let col3_name = 'collection3';
        //     fs.mkdirSync(db_name);
        //     fs.mkdirSync(db_name + col1_name);
        //     fs.mkdirSync(db_name + col2_name);
        //     fs.mkdirSync(db_name + col3_name);
        //
        //     let db = new monolite(db_name);
        //
        //     assert(db.status);
        //     assert(db.collection1);
        //     assert(db.collection2);
        //     assert(db.collection3);
        //
        //     done();
        // });
        //
        // it('database is directory with some files', function(done) {
        //     let db_name = 'mldb/';
        //     let file1_name = 'file1';
        //     let file2_name = 'file2';
        //     let file3_name = 'file3';
        //     fs.mkdirSync(db_name);
        //     fs.writeFileSync(db_name + file1_name);
        //     fs.writeFileSync(db_name + file1_name);
        //     fs.writeFileSync(db_name + file1_name);
        //
        //     let db = new monolite(db_name);
        //
        //     assert(db.status);
        //
        //     done();
        // });
        //
        // it('database is directory with some files and directories', function(done) {
        //     let db_name = 'mldb/';
        //     let col1_name = 'collection1';
        //     let col2_name = 'collection2';
        //     let col3_name = 'collection3';
        //     let file1_name = 'file1';
        //     let file2_name = 'file2';
        //     let file3_name = 'file3';
        //     fs.mkdirSync(db_name);
        //     fs.mkdirSync(db_name + col1_name);
        //     fs.mkdirSync(db_name + col2_name);
        //     fs.mkdirSync(db_name + col3_name);
        //     fs.writeFileSync(db_name + file1_name);
        //     fs.writeFileSync(db_name + file1_name);
        //     fs.writeFileSync(db_name + file1_name);
        //
        //     let db = new monolite(db_name);
        //
        //     assert(db.status);
        //     assert(db.collection1);
        //     assert(db.collection2);
        //     assert(db.collection3);
        //
        //     done();
        // });
    });

    describe('compress', function() {

    });

    describe('depress', function() {

    });
});