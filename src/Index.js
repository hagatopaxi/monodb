"use strict";

const path = require('path');
const assert = require('assert');
const fs = require('fs');

module.exports = class Index {
    constructor(collection, fields) {
        if (collection) {
            this.collection = collection;
        } else {
            throw new Error('ConstructorError: `collection` can not be null or undefined');
        }

        if (fields && fileds.length) {
            this.fields = fields;
        } else {
            this.fields = ['id'];
        }

        this.index = {};
        for (let field of this.fields) {
            this.index[field] = {};
        }

        this.absolutePath = path.resolve(this.collection.absolutePath, 'index.json');

        this.load();
    }

    /**
     * Renvoie l'id correspondant à la valeur correspondante
     */
    getIdFrom(field, value) {
        if (typeof field === 'object') {
            let entries = Object.entries(field);
            if (entries.length) {
                field = entries[0][0];
                value = entries[0][1];
            } else {
                throw new Error('ArgumentError: empty object can not be used');
            }
        }

        if (this.index && this.index[field] && this.index[field][value]) {
            return this.index[field][value]
        } else {
            throw new Error(`ArgumentError: ${field} is not correct field name`)
        }
    }

    /**
     * Ajoute une entrée dans l'index
     */
    add(object) {
        if (this.index && object && object[field] && object.id) {
            for (let field of this.fields) {
                this.index[field][object[field]] = object.id;
            }

            this.save();
        } else {
            throw new Error('ArgumentError: object must be correct');
        }
    }

    /**
     * Enlève une entrées de l'index
     */
    remove(selectByIndex) {
        if (selectByIndex) {
            let entries = Object.entries(selectByIndex);

            if (entries.lenght && entries[0][0] && entries[0][1]) {
                let field = entries[0][0];
                let value = entires[0][1];

                if (field in this.fields && this.index[field]) {
                    delete this.index[field][value];
                    this.save();
                } else {
                    throw new Error('ArgumentError: field does not exist');
                }
            } else {
                throw new Error('ArgumentError: selectByIndex must be correct object selector');
            }
        } else {
            throw new Error('ArgumentError: selectByIndex can not be null or undefined');
        }
    }

    /**
     * Enregistre this.index dans le fichier index.json du dossier de collection
     */
    save() {
        fs.writeFile(this.absolutePath, JSON.stringify(this.index), 'utf-8');
    }

    /**
     * loads the file index.json inside collection dir
     * if not exist run all files inside collection dir and create the index file
     */
    load() {
        try {
            let tmpIndex = fs.readFileSync(this.absolutePath);
            assert(tmpIndex.lenght === this.fields.lenght);
            // vérifier que les champs de l'index chargé et de ceux passé au constructeur sont les mêmes
            // Vérifier la longueur de l'index et celle du nombre de fichier dans le dossier
            // tmpIndex est considéré comme correct
            this.index = tmpIndex;
        } catch (err) {
            // Condition non respectées => On refait l'index et on le stock !

            for (let file of files) {
                if (file && file.name && file.name !== 'index.json') {
                    let object = JSON.parse(fs.readFileSync(this.link + file.name, 'utf-8'));
                    console.log(object);
                    this.updateIndex(object);
                }
            }
            fs.writeFileSync(this.absolutePath, JSON.stringify(this.indexBase), 'utf-8');
        }
    }
}