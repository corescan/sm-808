/**
 * simple array averaging fn
 */
module.exports = (array) => {
    let sum = array.reduce((prev, current) => current += prev);
    return sum / array.length;
}