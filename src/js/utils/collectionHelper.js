class collectionHelper {
  remove(array, element) {
    let index = array.indexOf(element);
    if (index >= 0) {
      array.splice(index, 1);
    }
  }
}

module.exports = new collectionHelper();