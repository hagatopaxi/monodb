"use strict";

const fs = require('fs').promises;

class MonoDB {
    // static dbPath = "./.database";

    constructor() {
        this._id = this._id || this.genId();
        this._creationDate = new Date();
        this._lastUpdateDate = new Date();

        this.setMeta();
        this.__colDir = `${MonoDB.dbPath}/${this.__meta.name}`;
        this.__filePath = `${this.__colDir}/${this.id}.json`;
        this.__fileLockPath = `${this.__filePath}.lock`;
    }

    async save() {
        await this.lock();

        try {
            await fs.stat(this.__colDir)
        } catch(err) {
            await fs.mkdir(this.__colDir, {recursive: true});
        }

        this._lastUpdateDate = new Date();

        try {
            let obj = {};

            for (let key of Object.keys(this)) {
                if (key[0] != '_' || key[1] != '_') {
                    obj[key] = this[key];
                }
            }

            await fs.writeFile(this.__filePath, JSON.stringify(obj));
        } catch(err) {
            console.error(err);
        }

        await this.unlock();
    }

    async delete() {
        try {
            await fs.stat(this.__colDir)
        } catch(err) {
            return;
        }

        try {
            await fs.unlink(this.__filePath, JSON.stringify(this));
        } catch(err) {
            console.error(err);
        }
    }

    equals(other) {
        return this.__meta.name === other.__meta.name && this.id === other.id;
    }

    genId() {
        return `${Math.random().toString(16).substring(3,7)}-${Math.random().toString(16).substring(3,7)}-${Math.random().toString(16).substring(3,7)}-${Math.random().toString(16).substring(3,7)}`
    }

    static async get(id) {
        try {
            await fs.stat(this.__colDir)
        } catch(err) {
            return false;
        }

        try {
            // Construire l'objet
            let obj = JSON.parse(await fs.readFile(this.__filePath, 'utf8'));
            obj = Object.assign(new this, obj);

            return obj;
        } catch(err) {
            console.error(err);
        }
    }

    static get dbPath() {
        return this.__dbPath || "./.database";
    }

    static set dbPath(path) {
        this.__dbPath = path;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    static async deleteDB() {
        await fs.rmdir(this.__dbPath, {recursive: true});
    }

    setMeta() {
        this.__meta = {
            name: this.constructor.name || this.name
        };
    }

    async lock() {
        try {
            await fs.stat(this.__filePath + '.lock');
        } catch(err) {
            await fs.rename(this.__filePath, this.__filePath + '.lock');
        }
    }

    async unlock() {
        await fs.rename(this.__filePath + '.lock', this.__filePat);
    }
}

module.exports = MonoDB;
