const NUM_DRINKS = 5;
const ALCOHOL_INDEX = 3;

// Given an inventory array and a recipe, subtracts the recipe from inventory
// Throws exception if any inventory value becomes negative
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

// Given a recipe and shots, returns the new recipe according to alc strength
exports.updateRecipe = function(recipe, shots) {
  var newRecipe = [];
  for (var i = 0; i < ALCOHOL_INDEX; i++) {
    newRecipe[i] = recipe[i]*shots;
  }

  return newRecipe.concat(recipe.splice(3,4));
}