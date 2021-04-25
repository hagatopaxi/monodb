'use strict'

const MonoDB = require('../src/MonoDB')
const { exec } = require('child_process')

class Car extends MonoDB {
  constructor (brand, model) {
    super()
    this.brand = brand
    this.model = model
  }

  setKm (km) {
    this.km = km
  }
};

class Person extends MonoDB {
  constructor (name) {
    super()
    this.name = name
    this.sex = undefined
  }
};

class Women extends Person {
  constructor (name) {
    super(name)
    this.sex = 'F'
  }
};

class Men extends Person {
  constructor (name) {
    super(name)
    this.sex = 'M'
  }
};

class User extends MonoDB {
  constructor (pseudo) {
    super(pseudo)
    this.pseudo = pseudo

    this.setKeyName('pseudo')
  }
}

class Food extends MonoDB {
  constructor (product, origin) {
    super()
    this.product = product
    this.origin = origin

    this.setIndex('origin')
  }
}

class Student extends MonoDB {
  constructor (classroom, level, school) {
    super()
    this.classroom = classroom
    this.level = level
    this.school = school

    this.setIndex(['classroom', 'level', 'school'])
  }
}

class Animal extends MonoDB {
  constructor (name) {
    super()
    this.name = name
    this.species = undefined
  }
}

class Cat extends Animal {
  constructor (name) {
    super(name)
    this.species = 'CAT'

    this.setParent(Animal)
  }
}

class Dog extends Animal {
  constructor (name) {
    super(name)
    this.species = 'DOG'

    this.setParent(Animal)
  }
}

function _beforeEach (done) {
  exec('rm -rf .database', done)
}

function _afterEach (done) {
  exec('rm -rf .database', done)
}

module.exports = {
  Car,
  Person,
  Men,
  Women,
  User,
  Food,
  Student,
  Animal,
  Cat,
  Dog,
  _beforeEach,
  _afterEach
}
