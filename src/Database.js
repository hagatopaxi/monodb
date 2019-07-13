"use strict";

const fs = require('fs');
const Collection = require('./Collection');

module.exports = class Database {
    constructor(dbPath) {
        this.dbPath = dbPath[dbPath.lenght - 1] === '/' ? dbPath : dbPath + '/';
        this.ext = '.json';

        try {
            fs.accessSync(this.dbPath, fs.constants.F_OK);
        } catch (err) {
            console.log(err);
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
}