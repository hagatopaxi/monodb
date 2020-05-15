"use strict";

const MonoDB = require('../src/MonoDB');
const mocha = require('mocha');
const assert = require('assert');
const exec = require('child_process').exec;

class Voiture extends MonoDB {
    constructor(brand, model) {
        super();
        this.brand = brand;
        this.model = model;
    }

    setKm(km) {
        this.km = km;
    }
};

class Personne extends MonoDB {
    constructor(name) {
        super();
        this.name = name;
        this.sex = undefined;
        this.__subclass = [Women, Men];
    }
};

class Women extends Personne {
    constructor(name) {
        super(name);
        this.sex = 'F';
    }
};

class Men extends Personne {
    constructor(name) {
        super(name);
        this.sex = 'M';
    }
};

describe('MonoDB', function() {
    before(function () {
        MonoDB.dbPath = ".dbTest";
    });

    describe('basics tests', function() {
        it('trivial test', async function () {
            let v1 = new Voiture("Fiat", "500");
            let v1_id = v1.id;
            await v1.save();

            v1 = null;

            let v2 = await Voiture.get(v1_id);
            assert(v2.id === v1_id);
            assert(v2.brand === "Fiat");
            assert(v2.model === "500");
        });

        it("dynamic field", async function() {
            let v1 = new Voiture("Fiat", "500");
            let v1_id = v1.id;
            v1.setKm(22);
            await v1.save();

            v1 = null;

            let v2 = await Voiture.get(v1_id);
            assert(v2.id === v1_id);
            assert(v2.brand === "Fiat");
            assert(v2.model === "500");
            assert(v2.km === 22);
        });

        it("equals", async function() {
            let v1 = new Voiture("Fiat", "500");
            await v1.save();
            let v2 = await Voiture.get(v1.id);

            assert(v1.equals(v2));
            assert(v2.equals(v1));
        });

        it("instanceof", async function() {
            let v1 = new Voiture("Fiat", "500");
            await v1.save();
            let v2 = await Voiture.get(v1.id);
            assert(v2 instanceof Voiture);
        });

        it("meta value (__fields)", async function () {
            let v1 = new Voiture("Fiat", "500");
            await v1.save();
            let v1_id = v1.id;
            v1 = null;
            let v2 = await Voiture.get(v1_id);

            assert(v2.__name);
            assert(v2.__colDir);
            assert(v2.__filePath);
        });
    });

    describe("inheritance", function () {
        it("simple  extends", async function () {
            let alice = new Women("Alice");
            let bob = new Men("Bob");

            await alice.save();
            await bob.save();

            let bob_id = bob.id;
            let alice_id = alice.id;

            alice = null;
            bob = null;

            bob = await Men.get(bob_id);
            alice = await Women.get(alice_id);

            assert(bob.name === "Bob");
            assert(bob.sex === "M");
            assert(alice.name === "Alice");
            assert(alice.sex === "F");
        });
    });

    describe("TODO test", function () {
        it("dirty read prevent");/*, async function() {
            let v1 = new Voiture("Fiat", "500");
            // On bloque artificiellement l'écriture de l'objet
            v1.save(-1);
            v1.lock(0);
            // Cette sauvegarde ne peut se faire tant que unlock n'est pas appelé.
            v1.brand = "Peugeot";
            v1.model = "205";
            await v1.save(1);

            let v2 = await Voiture.get(v1.id);
            assert(v2.equals(v1));
            assert(v2.brand === "Fiat");
            assert(v2.model === "500");

            v1.unlock(0);

            let v3 = await Voiture.get(v1.id);

            assert(v2.brand === "Peugeot");
            assert(v2.model === "205");
        });*/

        it("delete collection");
        it("delete database");
    });

    after(function () {
        exec("rm -r .dbTest");
    });
});
