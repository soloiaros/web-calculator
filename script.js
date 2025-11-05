function add (number1, number2) {
  return number1 + number2;
};

function substract (number1, number2) {
  return number1 - number2;
};

function multiply (number1, number2) {
  return number1 * number2;
};

function divide (number1, number2) {
  return number1 / number2;
};

function toPower (number, power) {
  return number ** power;
};

function getSin (number) {
  return Math.sin(number);
};

function getCos (number) {
  return Math.cos(number);
};

function getTan (number) {
  return Math.tan(number);
}

const operationRelations = {
  'addition': add,
  'multiplication': multiply,
  'substraction': substract,
  'division': divide,
  'power': toPower,
  'sin': getSin,
  'cos': getCos,
  'tan': getTan,
};

function operate (number1, operation, number2 = undefined) {
  if (operation in operationRelations) {
    return operationRelations[operation](number1, number2)
  } else {
    return 'error'
  };
};

function refreshDisplay (typeOfUpdate, valueToAdd = '') {
  const inputDisplay = document.querySelector('input')
  if (typeOfUpdate === 'addDigit') {
    const newValue = inputDisplay.value + valueToAdd;
    inputDisplay.value = newValue;
  } else if (typeOfUpdate === 'result') {
    inputDisplay.value = newValue;
  } else if (typeOfUpdate === 'clear') {
    inputDisplay.value = '';
  } else {
    new Error('Invalid typeOfUpdate, check your spelling.');
    // I should look up how to actually throw the error
  }
}

const numericButtons = Array.from(document.getElementsByClassName('numerical'));
numericButtons.forEach(button => {
  button.addEventListener(
    'click',
    function() {
      refreshDisplay(
      'addDigit',
      this.getAttribute('data-to-display'))
    }
  );
});