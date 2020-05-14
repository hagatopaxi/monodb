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
    });

    describe("advanced test", function () {
        it("dirty read prevent");
        it("meta always present");
        it("delete collection");
        it("delete database");
    });

    after(function () {
        exec("rm -r .dbTest");
    });
});
