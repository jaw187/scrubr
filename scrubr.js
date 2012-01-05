////
/////  new String() isn't a string, it's an Object
/////  I'm not sayin, I'm just sayin...
////
/////  


var EXPRESSIONS = {
  'username' : /^[A-z][A-Za-z0-9]{5,14}$/i,
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
    if (typeof val === 'string') {
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
  if (typeof v1 !== typeof v2)
    return false;

  if (typeof v1 === 'object')
    return COMPAREOBJS(v1,v2);

  if (typeof v1 === 'function')
    return v1.toString() === v2.toString();

  if (typeof v1 === 'string' || typeof v1 === 'number' || typeof v1 === 'boolean')
    return v1===v2;

  return false; // this could never happen....or could it?
}

var COMPAREOBJS = function (o1,o2) {
  for (var param in o1) {
    if (typeof o2[param] === "undefined")
      return false; 

    return COMPARE(o1[param],o2[param]);
  }
}

var TESTS = {

  'is' : function (value,expression) {
    if (typeof value === 'string') {
      if (Expressions[expression]) {
        value = Trim(value);
        return (Expressions[expression].test(value));
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

 'inBounds' : function (value,upperBound,lowerBound) {
    if (typeof value === typeof upperBound && typeof upperBound === typeof lowerBound && typeof lowerBound === 'number')
      return (lowerBound <= value <= upperBound);
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
            if (test === 'is') {
              
            }
            else if (test === 'isIn') {

            }
            else if (test === 'isString') {

            }
            else if (test === 'inBounds') {

            }
            else failures.push("Bad test for: " + field);
              
          }
          else if (DEFINITION[field].required) {
            failures.push(field + " is a required field");
          }
        }
      } 
    }
  }
  else return false;
}

exports.define = function (def) {
  DEFINITION = def;
}


exports.fail = function () {

}

exports.pass = function () {

}

exports.test = function (data,tests) {

}
