"use strict";

const fs = require('fs').promises;

class MonoDB {
    // static dbPath = "./.database";

    constructor() {
        this._id = this._id || this.genId();
        this._creationDate = this._creationDate || new Date();
        this._lastUpdateDate = new Date();

        /*** Meta properties ***/
        this.__name = this.constructor.name || this.name
        this.__colDir = `${MonoDB.dbPath}/${this.__name}`;
        this.__filePath = `${this.__colDir}/${this.id}.json`;
        this.__fileLockPath = `${this.__filePath}.lock`;
    }

    async save(call) {
        this.lock(call);
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
            throw "ReadError: " + this.__filePath + " do not exist";
        }

        this.unlock(call);
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
            throw "ReadError: " + this.__filePath + " do not exist";
        }
    }

    static async get(id) {
        let colDir = `${MonoDB.dbPath}/${this.name}`
        try {
            await fs.stat(colDir);
        } catch(err) {
            throw new Error("ReadError: " + this.name + " has no document reached");
        }

        let filePath = `${colDir}/${id}.json`
        let obj = {};

        try {
            obj = JSON.parse(await fs.readFile(filePath, 'utf8'));
        } catch(err) {
            console.log("2");
            throw "ReadError: " + this.name + "@" + id + " has no save";
        }

        obj = Object.assign(new this, obj);

        return obj;
    }

    equals(other) {
        return this.__name === other.__name && this.id === other.id;
    }

    genId() {
        return `${Math.random().toString(16).substring(3,7)}-${Math.random().toString(16).substring(3,7)}-${Math.random().toString(16).substring(3,7)}-${Math.random().toString(16).substring(3,7)}`
    }

    static get dbPath() {
        return this.__dbPath || "./.database";
    }

    static set dbPath(path) {
        this.__dbPath = path;
    }

    static getMutex(key) {
        if (this.__mutex) {
            return this.__mutex[key] || false;
        } else {
            return false;
        }
    }

    static addMutex(key) {
        if (!this.__mutex) {
            this.__mutex = {};
        }
        this.__mutex[key] = true;
    }

    static rmMutex(key) {
        this.__mutex[key] = false;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    static async deleteDB() {
        throw "Unavailable function";
    }

    get code() {
        return this.__name + "@" + this._id
    }

    /**
    * Si fichier avec .lock à la fin, on attend d'être réveillé
    * sinon on rajoute .lock et on sort de la function
    */
    lock(call) {
        // while (MonoDB.getMutex(this.code)) {}
        // MonoDB.addMutex(this.code);
    }

    /**
    * Si le fichier n'a pas de .lock à la fin renvoie une erreur: Appel de unlock hors context.
    * sinon enlève le .lock
    */
    unlock(call) {
        // if (!MonoDB.getMutex(this.code)) {
        //     throw new Error("Bad use of unlock");
        // }
        // MonoDB.rmMutex(this.code);
    }
}

module.exports = MonoDB;
