function isPlainObj(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}
function isArray(x) {
  return Array.isArray(x);
}
