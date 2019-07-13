"use strict";

const fs = require('fs');

module.exports = class Collection {
    constructor(name) {
        this._name = name;
    }

    /**
     * Créer un objet si l'id n'est pas définis, sinon update. Si l'id existe déjà
     */
    add(object, cb) {
        // // daiNote.create(new Note(req.body.title, req.body.type, ''));
        // if (typeof object === 'object') {
        //     object.id = object.id ? object.id : this.getNewId();
        //
        //     let path = this.link + object.id + this.ext;
        //
        //     fs.writeFile(path, JSON.stringify(object), function(err) {
        //         if (err) return cb(err);
        //         cb(null, object);
        //     });
        // } else {
        //     cb(new Error('ArgumentError: `object` argument is ' + object + ' must be an object'));
        // }
    }

    /**
     * Cherche un document en fonction de son id.
     * Renvoie null si le doc n'existe pas
     */
    find(selector, options, cb) {
        // if (typeof id === 'string') {
        //     let path = this.link + id + this.ext;
        //     fs.readFile(path, 'utf-8', function(err, res) {
        //         if (err) return cb(err);
        //         cb(null, JSON.parse(res));
        //     });
        // } else {
        //     cb(new Error('ArgumentError: `id` doit être un string'));
        // }
    }

    /**
     * Remplace les valeurs initials par celle de shard, les ajoutes si elles n'existait pas
     * Si l'id existait déjà, l'object est créer
     */
    update(shard, cb) {
        // if (typeof shard === 'object' && shard.id) {
        //     let path = this.link + shard.id + this.ext;
        //
        //     fs.readFile(path, 'utf-8', function(err, object) {
        //         if (err) {
        //             return cb(err);
        //         }
        //         object = JSON.parse(object);
        //
        //         // Update !
        //         // Toutes les clefs de l'objet update
        //         for (let key of Object.keys(shard)) {
        //             if (Array.isArray(shard[key])) {
        //                 if (Array.isArray(object[key])) {
        //                     // Switch pour les valeurs des opérations à réaliser sur les tableaux
        //                     switch (shard[key][0]) {
        //                         case 'append':
        //                             // Append value to original array
        //                             object[key] = object[key].concat(shard[key].slice(1));
        //                             break;
        //                         case 'removeByIdKey':
        //                             // Supprime la premier élement contenant la clef (unique) donnée
        //                             let subkey = Object.keys(shard[key][1])[0];
        //
        //                             object[key] = object[key].filter(function(value) {
        //                                 return value[subkey] !== shard[key][1][subkey];
        //                             });
        //                             break;
        //                         default:
        //                     }
        //                 } else {
        //                     cb(new Error('ArgumentError: ' + key + ' attribut must be array'));
        //                     return;
        //                 }
        //             } else {
        //                 object[key] = shard[key];
        //             }
        //         }
        //
        //         let str = JSON.stringify(object);
        //         fs.writeFile(path, str, 'utf-8', function(err) {
        //             if (err) return cb(err);
        //             cb(null);
        //         });
        //     });
        // } else {
        //     cb(new Error('ArgumentError: `shard` argument is' + shard + ' must be an object'));
        // }
    }

    remove(id, cb) {
        // if (typeof id === 'string') {
        //     let path = this.link + id + this.ext;
        //
        //     this.find(id, function(err, object) {
        //         if (err) return cb(err);
        //
        //         fs.unlink(path, function(err) {
        //             if (err) return cb(err);
        //             cb(null, object);
        //         });
        //     });
        // } else {
        //     cb(new Error('ArgumentError: `id` doit être un string'));
        // }
    }

    getNewId() {
        return `${Math.random().toString(16).substring(3,7)}-${Math.random().toString(16).substring(3,7)}-${Math.random().toString(16).substring(3,7)}-${Math.random().toString(16).substring(3,7)}`;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    toString() {
        return this.name;
    }
}