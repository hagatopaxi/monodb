"use strict";

const monolite = require('../');
const mocha = require('mocha');
const exec = require('child_process').exec;
const assert = require('assert');
const fs = require('fs');

describe('Collection', function() {

    describe('add', function() {

        it('add empty object document');

        it('add simple object document');

        it('add multiple layer object document');
    });

    describe('remove', function() {

        it('remove an unexisting object document');

        it('remove an existing object document with good id');

        it('remove an existing object document with bad id');

        it('remove an existing object document with good index');

        it('remove an existing object document with bad index');

        it('remove an existing object document with value not an index field');
    });

    describe('find', function() {

    });

    describe('update', function() {

    });

    describe('getNewId', function() {

    });
});