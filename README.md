# MonoDB

> :warning: This is beta version, use carfully for production

## Install

`npm i monodb`

## About

MonoDB is an extremely simple serialization system.  It allows to store objects in JSON files, and this via a very simple and intuitive class interface.

All objects are store in differente file, it's esay to view them inside file browser. The database are very simple structure :
```
+-- dbname
    +-- class1
        +-- object1_id.json
        +-- object2_id.json
    +-- class2
        +-- objetc1_id.json
```

If you know the id of your object it is very simple to find your file.


## How to use

### Declare class
```js
const MonoDB = require("monodb");

// Create your own class
class Person extends MonoDB {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    isLegalAge() {
        return age >= 18;
    }
}
```

### Create and save object

```js
let bob = new Person("Bob", 17);

// Promise behavior
bob.save().then(handle).catch(errHandle);

// or within async/await function

try {
    await bob.save();
} catch(err) {
    console.error(err);
}
```

### Retrieve object

```js
Person.get(bob.id).then(function (pers) {
    console.log(pers);
    // {   
    //     _id: "Some random id",
    //     name: "Bob",
    //     age: 17,
    //     _creationDate: "the date of call new operator",
    //     _lastUpdateDate: "the date of the last save"
    // }
});

// Or within async/await function

try {
    let bob = await Person.get(bob_id);
} catch(err) {
    console.error(err);
}
```

### Delete object

```js
bob.delete().then(handle).catch(errHandle);

// Or within async/await function

try {
    await bob.delete();
} catch(err) {
    console.error(err);
}
```

### Test equality between two objects

```js
let alice = new Person("Alice", 19);

bob.equals(alice); // False

bob.equals(bob); // True
```

By default `equals` return true if the id's are the same, but you can override it.

### Change database path

```js
MonoDB.dbPath = "/path/to/db";
```
Use this once in program to not change the destination storage and retrieve.

## Not supported

* Inheritance retrieve.
* Complexe request. Only the id's requests are available.

## TODO

- [ ] Index system to retrieve object from different keys.
- [ ] Full inheritance system.
- [ ] Isotalte the get and the save methods

## How to contribute

You can post a pull request or issue to help me. Else, you can send me an email with your suggestion.

### Run test

`npm run test`
