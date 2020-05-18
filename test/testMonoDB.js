"use strict";

const MonoDB = require('../src/MonoDB');
const mocha = require('mocha');
const assert = require('assert');
const exec = require('child_process').exec;

class Car extends MonoDB {
    constructor(brand, model) {
        super();
        this.brand = brand;
        this.model = model;
    }

    setKm(km) {
        this.km = km;
    }
};

class Person extends MonoDB {
    constructor(name) {
        super();
        this.name = name;
        this.sex = undefined;
    }
};

class Women extends Person {
    constructor(name) {
        super(name);
        this.sex = 'F';
    }
};

class Men extends Person {
    constructor(name) {
        super(name);
        this.sex = 'M';
    }
};

class User extends MonoDB {
    constructor(pseudo) {
        super(pseudo);
        this.pseudo = pseudo

        this.setKeyName("pseudo");
    }
}

class Food extends MonoDB {
    constructor(product, origin) {
        super();
        this.product = product;
        this.origin = origin;

        this.setIndex("origin");
    }
}

class Student extends MonoDB {
    constructor(classroom, level, school) {
        super();
        this.classroom = classroom;
        this.level = level;
        this.school = school;

        this.setIndex(["classroom", "level", "school"]);
    }
}

describe('MonoDB', function() {
    before(function () {
        MonoDB.dbPath = ".dbTest";
    });

    describe('basics tests', function() {
        it('trivial test', async function () {
            let v1 = new Car("Fiat", "500");
            let v1_id = v1.id;
            await v1.save();

            v1 = null;

            let v2 = await Car.get(v1_id);
            assert(v2.id === v1_id);
            assert(v2.brand === "Fiat");
            assert(v2.model === "500");
        });

        it("dynamic field", async function() {
            let v1 = new Car("Fiat", "500");
            let v1_id = v1.id;
            v1.setKm(22);
            await v1.save();

            v1 = null;

            let v2 = await Car.get(v1_id);
            assert(v2.id === v1_id);
            assert(v2.brand === "Fiat");
            assert(v2.model === "500");
            assert(v2.km === 22);
        });

        it("equals", async function() {
            let v1 = new Car("Fiat", "500");
            await v1.save();
            let v2 = await Car.get(v1.id);

            assert(v1.equals(v2));
            assert(v2.equals(v1));
        });

        it("instanceof", async function() {
            let v1 = new Car("Fiat", "500");
            await v1.save();
            let v2 = await Car.get(v1.id);
            assert(v2 instanceof Car);
        });

        it("delete document", async function() {
            let v1 = new Car("Fiat", "500");
            await v1.save();
            let v1_id = v1.id;
            
            await v1.delete();

            let retrieve = await Car.get(v1_id);
            assert(retrieve === null);
        });

        it("meta value (__fields)", async function () {
            let v1 = new Car("Fiat", "500");
            await v1.save();
            let v1_id = v1.id;
            v1 = null;
            let v2 = await Car.get(v1_id);

            assert(v2.__name);
            assert(v2.__colDir);
            assert(v2.__filePath);
        });

        it("promise feature", function(done) {
            let v1 = new Car("Fiat", "500");
            v1.save().then(function () {
                assert(true);
                done();
            }).catch(function () {
                assert(false);
            });
        });

        it("change key attribute", async function() {
            let u1 = new User("Hagatopaxi");
            try {
                await u1.save();
            } catch(err) {
                console.error(err);
            }

            assert(u1.id === "Hagatopaxi");
        });

        it("simple index feature", async function () {
            let f1 = new Food("Bread", "France");
            let f2 = new Food("Wine", "France");
            let f3 = new Food("Tea", "England");

            assert(f1.id);
            assert(f2.id);
            assert(f3.id);

            await f1.save();
            await f2.save();
            await f3.save();

            let foods = await Food.getByIndex("origin", "France");

            assert(foods.length == 2);
            assert(foods[0] instanceof Food);
            assert(foods[1] instanceof Food);

            // Order in index return are not conserve
            assert(foods[0].equals(f1) && foods[1].equals(f2) || foods[0].equals(f2) && foods[1].equals(f1));
        });

        it("multiple index feature", async function () {
            let s1 = new Student("math", 1, "Paris");
            let s2 = new Student("math", 1, "Grenoble");
            let s3 = new Student("math", 2, "Paris");
            let s4 = new Student("physic", 2, "Grenoble");
            let s5 = new Student("physic", 3, "Paris");
            let s6 = new Student("physic", 3, "Grenoble");

            await Promise.all([s1.save(), s2.save(), s3.save(), s4.save(), s5.save(), s6.save()]);

            let schools = await Student.getByIndex("school", "Paris");
            assert(schools.length === 3);
            assert(schools[0].school === "Paris");
            assert(schools[1].school === "Paris");
            assert(schools[2].school === "Paris");

            let levels = await Student.getByIndex("level", "1");
            assert(levels.length === 2);
            assert(levels[0].level === 1);
            assert(levels[1].level === 1);

            let classrooms = await Student.getByIndex("classroom", "physic");
            assert(classrooms.length === 3);
            assert(classrooms[0].classroom === "physic");
            assert(classrooms[1].classroom === "physic");
            assert(classrooms[2].classroom === "physic");
        });

        it("delete index after delete document", async function() {
            let s1 = new Student("chemestry", 1, "Paris");
            let s2 = new Student("chemestry", 1, "Grenoble");

            await s1.save();
            await s2.save();

            let students = await Student.getByIndex("classroom", "chemestry");

            assert(students.length === 2);
            assert(students[0].school === "Paris" || students[0].school === "Grenoble");
            assert(students[1].school === "Grenoble" || students[1].school === "Paris");

            await s1.delete();

            students = await Student.getByIndex("classroom", "chemestry");
            assert(students.length === 1);
            assert(students[0].school === "Grenoble");
        });
    });

    describe("bad usage tests, should throw exception", function() {
        it("document does not exist", async function() {
            let car = new Car("Mini", "One D");

            try {
                await Car.get(car.id);
                assert(false);
            } catch(err) {
                assert(true);
            }
        });

        it("keyName not a field", async function() {
            class BadClass extends MonoDB {
                constructor(field) {
                    super();
                    this.field = field;

                    this.setKeyName("NotExsit");
                }
            }

            try {
                let badClass = new BadClass("example");
                assert(false);
            } catch(err) {
                assert(true);
            }
        });

        it("simple index not fields", async function() {
            class BadClass extends MonoDB {
                constructor(field) {
                    super();
                    this.field = field;

                    this.setIndex(["NotExsit", "field"]);
                }
            }

            try {
                let badClass = new BadClass("example");
                assert(false);
            } catch(err) {
                assert(true);
            }
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

        it("polymorphism"); /*, async function () {
            let alice = new Women("Alice");
            let bob = new Men("Bob");

            await alice.save();
            await bob.save();

            let bob_id = bob.id;
            let alice_id = alice.id;

            alice = null;
            bob = null;

            bob = await Person.get(bob_id);
            alice = await Person.get(alice_id);

            assert(bob.name === "Bob");
            assert(bob.sex === "M");
            assert(alice.name === "Alice");
            assert(alice.sex === "F");
        });*/
    });

    describe("TODO test", function () {
        it("dirty read prevent");/*, async function() {
            let v1 = new Car("Fiat", "500");
            // On bloque artificiellement l'écriture de l'objet
            v1.save(-1);
            v1.lock(0);
            // Cette sauvegarde ne peut se faire tant que unlock n'est pas appelé.
            v1.brand = "Peugeot";
            v1.model = "205";
            await v1.save(1);

            let v2 = await Car.get(v1.id);
            assert(v2.equals(v1));
            assert(v2.brand === "Fiat");
            assert(v2.model === "500");

            v1.unlock(0);

            let v3 = await Car.get(v1.id);

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
