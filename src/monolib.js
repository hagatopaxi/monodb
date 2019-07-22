/**
 * Calcule la différence entre deux tableaux sans tenir compte des indices
 */
exports.arrayDiff = function(arr1, arr2) {
    return arr1.filter(function(el) {
        return arr2.indexOf(el) < 0;
    });
};