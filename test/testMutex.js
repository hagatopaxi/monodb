"use strict";

const Mutex = require('../src/Mutex');
const assert = require('assert');
const exec = require('child_process').exec;

describe("Test Mutex", function () {
    it("use constructor", function (done) {
        var output = "";

        let m = new Mutex();
        m.lock(function (unlock) {
            setTimeout(function () {
                output += "A";
                unlock();
            }, 100);
        });

        m.lock(function (unlock) {
            setTimeout(function () {
                output += "B";
                unlock();
            }, 50);
        });

        m.lock(function (unlock) {
            setTimeout(function () {
                output += "C";
                unlock();

                assert(output === "ABC");
                done();
            }, 10);
        });
    });

    it("use getLock with same key return same instance", function () {
        let m1 = Mutex.getLock("SomeKey");
        let m2 = Mutex.getLock("SomeKey");

        assert(m1 === m2);
    });

    it("use getLock with differene key return different instance", function () {
        let m1 = Mutex.getLock("SomeKey");
        let m2 = Mutex.getLock("OtherKey");

        assert(m1 !== m2);
    });
});
