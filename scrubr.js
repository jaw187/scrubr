////
/////  new String() isn't a string, it's an Object
/////  I'm not sayin, I'm just sayin...
////
///// 

var util=require('util'); 


var EXPRESSIONS = {
  'username' : /^[A-z][A-Za-z0-9]{4,14}$/i,
  'password' : /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  'email' : /\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i,
  'phone' : /^[0-9\-\+\s\.\(\)]{5,16}$/,
  'address' : /^[A-z0-9\-\+\s\.,]+$/,
  'url' : /^((http|https|ftp):\/\/)?([A-z0-9\-]\.)*[A-z0-9\-]+\.[A-z0-9]{2,4}[A-z0-9\/+=%&_\.~?\-]*$/,
  'twitter' : /(@)?[A-z0-9_]+/,
  'facebook' : /^[A-z0-9\.]{5,}$/
}

var SQL_SINGLE_QUOTE_REPLACEMENT = '&#146;';

var DEFINITION = false;

var TRIM = function(value) {
  if (typeof value === 'string') {
    value = value.replace(/^\s+/,'');
    value = value.replace(/\s+$/,'');
  }

  return value;
}

var SCRUB = {
  'SQL' : function (val) {
    if (val.replace) {
      val = val.replace(/'/g,SQL_SINGLE_QUOTE_REPLACEMENT);
      return val; 
    }
    else {
      //ERROR
      
    }
  },
  'HTML' : function (val) {

  }
}

var COMPARE = function (v1,v2) {
  if (v1 === v2)
    return true;

  if (typeof v1 !== typeof v2)
    return false;

  if (typeof v1 === 'object')
    return COMPAREOBJS(v1,v2);

  if (typeof v1 === 'function')
    return v1.toString() === v2.toString();

  return false; // this could never happen....or could it?
}

var COMPAREOBJS = function (o1,o2) {
  var param;
  for (param in o1) {
    if (typeof o2[param] === "undefined")
      return false; 
  }

  for (param in o2) {
    if (typeof o1[param] === "undefined")
      return false;

    //if they're the same, toString() should be the same....
    if (param === 'toString' && typeof o1.toString === 'function' && typeof o2.toString === 'function')
      return (o1.toString() === o2.toString())

    if (!COMPARE(o1[param],o2[param]))
      return false;
  }

  return true;
}

var TESTS = {

  'is' : function (value,expression) {
    if (typeof value === 'string') {
      if (EXPRESSIONS[expression] && util.isRegExp(EXPRESSIONS[expression])) {
        value = TRIM(value);
        return (EXPRESSIONS[expression].test(value));
      }
    }

    return false;
  },

  'isIn' : function (value,list,caseinsensitive) {
    for (var i=0;i<list.length;i++) {
      if (COMPARE(list[i],value))
        return true;
      if (caseinsensitive && typeof list[i] === 'string' && typeof value === 'string') {
        if (value.toUpperCase() === list[i].toUpperCase()) 
          return true
      }
    }
    return false;
  },

  'isString' : function (value) {
    return typeof value === 'string';
  },

  'isArray' : function (value) {
    return util.isArray(value);
  },

  'isDate' : function (value) {
    return util.isDate(value);
  },

 'inBounds' : function (value,upperBound,lowerBound) {
    if (typeof value === typeof upperBound && typeof upperBound === typeof lowerBound && typeof lowerBound === 'number')
      return (lowerBound <= value && value <= upperBound);

    return false;
  }
}


exports.scrub = function(data) {
  var failures = [];
  var field;
  var test;
  if (DEFINITION) {
    for (field in DEFINITION) {
      for (test in DEFINITION[field]) {
        if (test !== 'required') {
          if (data[field]) {
            switch(test) {
              case 'is' :
                if (!TESTS.is(data[field],DEFINITION[field].is))
                  failures.push(field + ' is not a valid ' + DEFINITION[field].is);
                break;
              case 'isIn' :
                if (!TESTS.isIn(data[field],DEFINITION[field].isIn,DEFINITION[field].caseinsensitive))
                  failures.push(field + ' is not a valid value');
                break;
              case 'isString' :
                if (!TESTS.isString(data[field])) 
                  failures.push(field + ' is not a string');
                break
              case 'inBounds' :
                if (!TESTS.inBounds(data[field],DEFINITION[field].inBounds.upper,DEFINITION[field].inBounds.lower))  {
                  failures.push(field + ' is not within the bounds of ' + 
                                DEFINITION[field].inBounds.upper + '(upper) and ' + 
                                DEFINITION[field].inBounds.lower);
                }
                break;
              default :
                failures.push("Bad test for: " + field);
            }
          }
          else if (DEFINITION[field].required) {
            failures.push(field + " is a required field");
          }
        }
      } 
    }
    if (failures.length === 0) {
      this.pass();
      return true;
    }
    else {
      this.fail(failures);
      return false;
    }
  }
  else {
    this.fail(['DEFINITION does not exist']);
    return false;
  }
}

exports.define = function (def) {
  DEFINITION = def;
}


exports.fail = function (failures) {
  for (var i=0;i<failures.length;i++) {
    console.log(failures[i]);
  }
}

exports.pass = function () {
  console.log("PASSSSSSS");
}
