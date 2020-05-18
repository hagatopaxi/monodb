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

### Set custom id

You can save yours objects with custom key with the method `setKeyName`.
Do not edit this field after and be shure the values inside are unique.
The field `id` are the same as you custom field.

Or you can override the field `id`, but you loose the meaning.

```js
class User extends MonoDB {
    constructor(pseudo) {
        super(pseudo);
        this.pseudo = pseudo

        this.setKeyName("pseudo");
        // Now this.id === this.pseudo
        // The both field exist
    }
}

let user = new User("Hagatopaxi");

// To retrieve you can do
User.get("Hagatopaxi").then(handle).catch(errHandle);

// Or within async/await function
try {
    await User.get("Hagatopaxi");
} catch(err) {
    console.error(err);
}
```

### Make index

The index feature is very minimal.
Having one or more indexes slows down save and delete feature. Getting object by `id` or by index are the same cost as without index.

```js
class Student extends MonoDB {
    constructor(classroom, level, school) {
        super();
        this.classroom = classroom;
        this.level = level;
        this.school = school;

        this.setIndex(["classroom", "school"]);
    }
}

// Getting is almost same
Student.getByIndex("classroom", "value").then(handle).catch(errHandle);

// Or within async/await function
try {
    await Student.getByIndex("classroom", "value");
} catch(err) {
    console.error(err);
}
```

Here we store the index relation with symbolic links. So we have this structur (`@` represente symbolic links):

```
+-- dbname
    +-- class1
        +-- indexName1
            +-- value1
                +-- object1_id.json
            +-- value2
                +-- object2_id.json
        +-- object1_id.json
        +-- object2_id.json
```

Objects with the same value for the same index are store inside same directory (different value different directory). Behavior when updating fields which are indexes is not define.

Save and delete object which have index is same.

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
