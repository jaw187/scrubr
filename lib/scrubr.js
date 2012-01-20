////
/////  new String() isn't a string, it's an Object
/////  I'm not sayin, I'm just sayin...
////
///// 

var util=require('util'),
    url=require('url'),
    compr = require('compr'),
    tests=require('./tests'),
    scrubers=require('./scrubers'),
    DEFINITION = null;

var validateDefinition = function (def) {
  var badTests=[];
  for (field in def) {
    for (test in def[field]) {
      if (test === "scrub") {
        for (var i = 0; i < def[field].scrub; i++) {
          if (!scrubers[def[field].scrub[i]]) {
            badTests.push(s + " is not a known scruber");
          }
        }
      }
      else if (test !== "required" && !tests.exists(test)) {
        badTests.push(test + " is a bad test for " + field);
      }
    }
  }
  if (badTests.length > 0) {
    return new Error(badTests);
  }
  else return true;
}

exports.scrub = function() {
  if (arguments.length > 1) {
    var req = arguments[0],
        res = arguments[1],
        next = arguments[2],
        routes = arguments[3],
        data = req.body;
  }
  else data = arguments[0];

  var failures = [],
      field,
      test,
      args;

  if (DEFINITION) {
    for (field in DEFINITION) {
      if (DEFINITION[field].scrub && DEFINITION[field].scrub.length > 0) {
        for (var i=0;i<DEFINITION[field].scrub.length;i++) {
          if (scrubers[DEFINITION[field].scrub[i]]) {
            data[field] = scrubers[DEFINITION[field].scrub[i]](data[field]);
          }
          else {
            //error
          }
        }
      }
      for (test in DEFINITION[field]) {
        if (test !== 'required' && test !== 'scrub') {
          if (data[field]) {
//TODO Case builds args.  One call to tests.run.  failures from tests.getErrorMessage
            switch(test) {
              case 'is' :
                if (!tests.run(test,[data[field],DEFINITION[field].is]))
                  failures.push(field + ' is not a valid ' + DEFINITION[field].is);
                break;
              case 'isIn' :
                if (!tests.run('isIn',[data[field],DEFINITION[field].isIn,DEFINITION[field].caseinsensitive]))
                  failures.push(field + ' is not a valid value');
                break;
              case 'isString' :
                if (!tests.run('isString',[data[field]]))
                  failures.push(field + ' is not a string');
                break;
              case 'inBounds' :
                if (!tests.run('inBounds',[data[field],DEFINITION[field].inBounds.upper,DEFINITION[field].inBounds.lower])) {
                  failures.push(field + ' is not within the bounds of ' + 
                                DEFINITION[field].inBounds.upper + '(upper) and ' + 
                                DEFINITION[field].inBounds.lower);
                }
                break;
              case 'has' :
                if (!tests.run('has',[data[field],DEFINITION[field].param]))
                  failures.push(field + ' does not contain a ' + DEFINITION[field].param);
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
      this.pass(next);
      return true;
    }
    else {
      this.fail(failures,req,res,next,routes);
      return false;
    }
  }
  else {
    this.fail(['DEFINITION does not exist'],req,res,next,routes);
    return false;
  }
}

exports.middleware = function (routes) {
  return function (req,res,next) {
    if (req.body && !(compr.compare(req.body,{}))) { 
      exports.scrub(req,res,next,routes);
    }
    else next();
  }
}

exports.define = function (def) {
  defCheck = validateDefinition(def);
  if (defCheck === true)
    DEFINITION = def;

  return defCheck;
}


exports.fail = function (failures,req,res,next,routes) {
  console.log("FAIL");
  for (var i=0;i<failures.length;i++) {
    console.log(failures[i]);
  }

  if (req && req.headers && req.headers.referer) {
    req.url = url.parse(req.header('referer')).path;
    req.method = 'GET';
    req.scrubr = { failures: failures };
    next();
  }
  else next('Referrer Undefined');
}

exports.pass = function (next) {
  console.log("PASSSSSSS");
  if (next) next();
}
