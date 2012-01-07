exports.compare = function (v1,v2) {
  if (v1 === v2)
    return true;

  if (typeof v1 !== typeof v2)
    return false;

  if (typeof v1 === 'object')
    return this.compareobjs(v1,v2);

  if (typeof v1 === 'function')
    return v1.toString() === v2.toString();

  return false;
}

exports.compareobjs = function (o1,o2) {
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

    if (!this.compare(o1[param],o2[param]))
      return false;
  }

  return true;
}

