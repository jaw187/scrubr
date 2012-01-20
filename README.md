Scrubr
======
Because we can never trust data a client sends to us.

Install
-------
```
$ npm install scrubr
```

Assumptions
-----------
- Forms are displayed using the GET method.

Example
-------

```javascript
scrubr = require('scrubr')

definition = {
  username: { is: 'username', required: true, scrub:['sql'] },
  password: { is: 'password', required: true },
  state: { isIn: [ 'NJ', 'CA' ] },
  comment: { isString: true, scrub: ['html','sql'] },
  age : { inBounds: { upper: 10, lower: 5 } }
}

body = {
  username : 'james',
  password : 'HHHHjjjj1111',
  state : 'NJ',
  comment : 'a',
  age : 6
}

scrubr.define(definition);

scrubr.scrub(body);
//// PASSSSSSS

body.age=22;
scrubr.scrub(body);
//// FAIL
// age is not within the bounds of 10(upper) and 5
```

Middleware
----------

```javascript

```
