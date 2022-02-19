 /**preamble to order params in ascending (alphabetical) order**/
 function isObject(obj) { return obj !== undefined && obj !== null && obj.constructor == Object; }
 function isArray(obj) { return obj !== undefined && obj !== null && obj.constructor == Array; }
 function arrayToString(obj) { return obj.reduce((a, b) => { return a + (isObject(b) ? objectToString(b) : (isArray(b) ? arrayToString(b) : b)); }, ""); }
 /**sort params**/
 function objectToString(obj) { return (obj == null ? "" : Object.keys(obj).sort().reduce((a, b) => { return a + b + (isArray(obj[b]) ? arrayToString(obj[b]) : (isObject(obj[b]) ? objectToString(obj[b]) : obj[b])); }, "")); }

 module.exports = {
     isObject: isObject,
     isArray: isArray,
     objectToString: objectToString
 };