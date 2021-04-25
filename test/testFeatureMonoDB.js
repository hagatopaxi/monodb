'use strict'

const MonoDB = require('../src/MonoDB')
const assert = require('assert')
const { _beforeEach, _afterEach, Car, Student, User, Food } = require('./utils')

describe('MonoDB -> Features tests', function () {
  this.timeout(5000)

  beforeEach(_beforeEach)

  it('trivial test', async function () {
    let v1 = new Car('Fiat', '500')
    const v1Id = v1.id
    await v1.save()

    v1 = null

    const v2 = await Car.get(v1Id)
    assert(v2.id === v1Id)
    assert(v2.brand === 'Fiat')
    assert(v2.model === '500')
  })

  it('dynamic field', async function () {
    let v1 = new Car('Fiat', '500')
    const v1Id = v1.id
    v1.setKm(22)
    await v1.save()
    v1 = null

    const v2 = await Car.get(v1Id)
    assert(v2.id === v1Id)
    assert(v2.brand === 'Fiat')
    assert(v2.model === '500')
    assert(v2.km === 22)
  })

  it('equals', async function () {
    const v1 = new Car('Fiat', '500')
    await v1.save()
    const v2 = await Car.get(v1.id)

    assert(v2)
    assert(v1.equals(v1))
    assert(v1.equals(v2))
    assert(v2.equals(v1))
  })

  it('instanceof', async function () {
    const v1 = new Car('Fiat', '500')
    await v1.save()
    const v2 = await Car.get(v1.id)
    assert(v2 instanceof Car)
  })

  it('delete document', async function () {
    const v1 = new Car('Fiat', '500')
    await v1.save()
    const v1Id = v1.id

    await v1.delete()

    const retrieve = await Car.get(v1Id)
    assert(retrieve === null)
  })

  it('meta value are not visible (__fields)', async function () {
    let v1 = new Car('Fiat', '500')
    await v1.save()
    const v1Id = v1.id
    v1 = null
    const v2 = await Car.get(v1Id)

    assert(!v2.__name)
    assert(!v2.__colDir)
    assert(!v2.__filePath)
    assert(!v2.__keyName)
    assert(!v2.__index)
    assert(!v2.__mutex)
  })

  it('promise feature', function (done) {
    const v1 = new Car('Fiat', '500')
    v1.save().then(function () {
      assert(true)
      done()
    }).catch(function () {
      assert(false)
    })
  })

  it('change key attribute', async function () {
    const u1 = new User('Hagatopaxi')
    try {
      await u1.save()
    } catch (err) {
      assert(false)
    }

    assert(u1.id === 'Hagatopaxi')
  })

  it('simple index feature', async function () {
    const f1 = new Food('Bread', 'France')
    const f2 = new Food('Wine', 'France')
    const f3 = new Food('Tea', 'England')

    assert(f1.id)
    assert(f2.id)
    assert(f3.id)

    await f1.save()
    await f2.save()
    await f3.save()

    const foods = await Food.getByIndex('origin', 'France')

    assert(foods.length === 2)
    assert(foods[0] instanceof Food)
    assert(foods[1] instanceof Food)

    // Order in index return are not conserve
    assert((foods[0].equals(f1) && foods[1].equals(f2)) || (foods[0].equals(f2) && foods[1].equals(f1)))
  })

  it('multiple index feature', async function () {
    const s1 = new Student('math', 1, 'Paris')
    const s2 = new Student('math', 1, 'Grenoble')
    const s3 = new Student('math', 2, 'Paris')
    const s4 = new Student('physic', 2, 'Grenoble')
    const s5 = new Student('physic', 3, 'Paris')
    const s6 = new Student('physic', 3, 'Grenoble')

    await Promise.all([s1.save(), s2.save(), s3.save(), s4.save(), s5.save(), s6.save()])

    const schools = await Student.getByIndex('school', 'Paris')
    assert(schools.length === 3)
    assert(schools[0].school === 'Paris')
    assert(schools[1].school === 'Paris')
    assert(schools[2].school === 'Paris')

    const levels = await Student.getByIndex('level', '1')
    assert(levels.length === 2)
    assert(levels[0].level === 1)
    assert(levels[1].level === 1)

    const classrooms = await Student.getByIndex('classroom', 'physic')
    assert(classrooms.length === 3)
    assert(classrooms[0].classroom === 'physic')
    assert(classrooms[1].classroom === 'physic')
    assert(classrooms[2].classroom === 'physic')
  })

  it('delete index after delete document', async function () {
    const s1 = new Student('chemestry', 1, 'Paris')
    const s2 = new Student('chemestry', 1, 'Grenoble')

    await s1.save()
    await s2.save()

    let students = await Student.getByIndex('classroom', 'chemestry')

    assert(students.length === 2)
    assert(students[0].school === 'Paris' || students[0].school === 'Grenoble')
    assert(students[1].school === 'Grenoble' || students[1].school === 'Paris')

    await s1.delete()

    students = await Student.getByIndex('classroom', 'chemestry')
    assert(students.length === 1)
    assert(students[0].school === 'Grenoble')
  })

  it('object reduce size', async function () {
    class Exemple extends MonoDB {
      constructor () {
        super()
        this.arr = 'Very loooooooooooonnng string'
      }
    }

    const ex = new Exemple()
    await ex.save()

    ex.arr = 'shorter string'

    await ex.save()

    const retrieve = await Exemple.get(ex.id)
    assert(retrieve)
  })

  it('delete collection')
  it('delete database')

  afterEach(_afterEach)
})
