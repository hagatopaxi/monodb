"use strict";

const fs = require('fs');

module.exports = class Database {
    constructor(dbPath) {
        this.dbPath = dbPath[dbPath.lenght - 1] === '/' ? dbPath : dbPath + '/';
        this.ext = '.json';
        let _files = fs.readdirSync(this.dbPath, {
            withFileTypes: true
        });

        for (let _file of _files) {
            if (_file.isDirectory()) {
                this[_file.name] = new Collection(_file.name);
            }
        }
    }
}