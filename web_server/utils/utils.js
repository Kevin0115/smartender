const NUM_DRINKS = 5;

exports.updateInventory = function(inventory, recipe) {
  var newInventory = [];
  for (var i = 0; i < NUM_DRINKS; i++) {
    var newVolume = inventory[i] - recipe[i];
    if (newVolume < 0) {
      throw "Not Enough Inventory"; 
    } else {
      newInventory[i] = newVolume;
    }
  }
  return newInventory;
}