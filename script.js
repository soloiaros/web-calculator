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
  '+': add,
  '*': multiply,
  '-': substract,
  '/': divide,
  '^': toPower,
  'sin': getSin,
  'cos': getCos,
  'tan': getTan,
};

function operate (number1, number2, operation) {
  if (operation in operationRelations) {
    return operationRelations[operation](Number(number1), Number(number2))
  } else {
    throw new Error('Unknown operator')
  };
};

function checkRefreshAllowed (symbol) {
  const inputDisplay = document.querySelector('input');
  if (symbol === '.') {
    return !(inputDisplay.value.includes('.'));
  } else if (symbol in operationRelations) {
    number1 = Number(inputDisplay.value);
    return inputDisplay.value
      .split('')
      .every(char => !(char in operationRelations))
  }
  return true
}

function refreshDisplay (valueToAdd = '', clean = false) {
  const inputDisplay = document.querySelector('input');
  if (!clean) {
    if (checkRefreshAllowed(valueToAdd)) {
      const newValue = inputDisplay.value + valueToAdd;
      inputDisplay.value = newValue;
    }
  } else {
    inputDisplay.value = valueToAdd;
  }
}

const numericButtons = Array.from(document.getElementsByClassName('add-value'));
numericButtons.forEach(button => {
  button.addEventListener(
    'click',
    function() {
      refreshDisplay(this.getAttribute('data-to-display'));
    }
  );
});

const clearButton = document.querySelector('#clear');
clearButton.addEventListener(
  'click',
  function() {
    refreshDisplay('', true);
  }
)

const evalButton = document.querySelector('#eval');
evalButton.addEventListener(
  'click',
  function() {
    const inputDisplay = document.querySelector('input');
    const displayValue = inputDisplay.value;
    const [number1, number2] = displayValue.split(/\s\D\s/);
    const operator = displayValue.at(displayValue.search(/\s\D\s/) + 1)
    refreshDisplay(operate(number1, number2, operator), true);
  }
)