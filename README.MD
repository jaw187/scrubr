Scrubr
======
Because we can never trust data a client sends to us.

```javascript
scrubr = require('./scrubr')

definition = { 
  username: { is: 'username', required: true },
  password: { is: 'password', required: true },
  state: { isIn: [ 'NJ', 'CA' ] },
  string: { isString: true },
  age : { inBounds: { upper: 10, lower: 5 } } 
}

scrubr.define(definition);

body = {
  username : 'james',
  password : 'HHHHjjjj1111',
  state : 'NJ',
  string : 'a',
  age : 6
}

scrubr.scrub(body);
//// PASSSSSSS

body.age=22;
scrubr.scrub(body);
//// FAIL
//   age is not within the bounds of 10(upper) and 5
```

Dependicies
-----------

- Caja-HTML-Sanitizer [https://github.com/theSmaw/Caja-HTML-Sanitizer](https://github.com/theSmaw/Caja-HTML-Sanitizer)
