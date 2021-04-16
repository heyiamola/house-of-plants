function optionPreselected(constantArray, preSelectedValue) {
  let newConstantArray = constantArray.map(function (value) {
    let preselected;
    console.log(value);
    if (preSelectedValue === value) {
      console.log(preSelectedValue === value);
      preselected = "checked";
    } else {
      preselected = "";
    }
    return [value, preselected];
  });
  return newConstantArray;
}

module.exports = optionPreselected;
