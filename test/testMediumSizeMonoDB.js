'use strict'

const { _beforeEach, _afterEach, User } = require('./utils')
const assert = require('assert')
const fs = require('fs')

describe('Medium Size database ~ 10Mo', function () {
  this.timeout(5000)

  beforeEach(_beforeEach)

  // afterEach(_afterEach)

  before(async function () {
    // Build a medium dataset, 1 classes with 10K file
    for (let i = 0; i < 10000; i++) {
      await new User('User N. ' + i).save()
    }
  })

  it('Access to an element', function (done) {
    const randUserId = `User N. ${Math.floor(Math.random() * 10000)}`
    // const user = User.get(randUserId).then

    const filePath = '.database/User/' + randUserId + '.json'
    fs.readFile(filePath, 'utf8', function (err, res) {
      console.log(err, res)
      done()
    })

    // assert(user)
    // assert(user.id === randUserId)
  })
})
