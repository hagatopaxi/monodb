"use strict";

const fs = require('fs');
const path = require('path');
const Collection = require('./Collection');

module.exports = class Database {
    constructor(dbName) {
        this.dbName;
        this.dbPath = path.resolve(this.dbName);
        this.ext = '.json';

        try {
            fs.accessSync(this.dbPath, fs.constants.F_OK);
        } catch (err) {
            if (err.code === 'ENOENT') {
                fs.mkdirSync(dbPath);
            } else {
                throw err;
            }
        }

        let _files = fs.readdirSync(this.dbPath, {
            withFileTypes: true
        });

        for (let _file of _files) {
            if (_file.isDirectory()) {
                this[_file.name] = new Collection(_file.name);
            }
        }
        this.status = true;
    }

    createCollection(colName, cb) {
        fs.mkdir(this.dbPath + colName, cb);
    }

    get collectionNames() {
        return Object.keys(this);
    }
}