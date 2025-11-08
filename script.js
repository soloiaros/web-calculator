function add (number1, number2) {
  return number1 + number2;
};

function substract (number1, number2) {
  return number1 - number2;
};

function multiply (number1, number2) {
  returnValue = String(number1 * number2);
  if (returnValue.length > 12 && returnValue.includes('.')) {
    return returnValue.slice(0, 12)
  }
  return returnValue;
};

function divide (number1, number2) {
  returnValue = String(number1 / number2);
  if (returnValue.length > 12 && returnValue.includes('.')) {
    return returnValue.slice(0, 12)
  }
  return returnValue;
};

function toPower (number, power) {
  returnValue = String(number ** power);
  if (returnValue.length > 12 && returnValue.includes('.')) {
    return returnValue.slice(0, 12)
  }
  return returnValue;
};

function getSin (number) {
  returnValue = String(Math.sin(number));
  if (returnValue.length > 12 && returnValue.includes('.')) {
    return returnValue.slice(0, 12)
  }
  return returnValue;
};

function getCos (number) {
  returnValue = String(Math.cos(number));
  if (returnValue.length > 12 && returnValue.includes('.')) {
    return returnValue.slice(0, 12)
  }
  return returnValue;
};

function getTan (number) {
  returnValue = String(Math.tan(number));
  if (returnValue.length > 12 && returnValue.includes('.')) {
    return returnValue.slice(0, 12)
  }
  return returnValue;
}

const basicOperationRelations = {
  '+': add,
  '*': multiply,
  '-': substract,
  '/': divide,
  '^': toPower,
};

const trigOperationRelations = {
  'sin': getSin,
  'cos': getCos,
  'tan': getTan,
}

function operate (number1, operation, number2 = '') {
  if (operation in basicOperationRelations) {
    return basicOperationRelations[operation](Number(number1), Number(number2))
  } else if (operation in trigOperationRelations) {
    return trigOperationRelations[operation](Number(number1))
  } else {
    throw new Error('Unknown operator')
  };
};

function checkRefreshAllowed (symbol) {
  const inputDisplay = document.querySelector('input');
  if (symbol === '.' && getDisplayValues()[0].at(-1).includes('.')) {
    return false;
  } else if (symbol in basicOperationRelations || symbol in trigOperationRelations) {
    number1 = Number(inputDisplay.value);
    return inputDisplay.value
      .split('')
      .every(char => !(char in basicOperationRelations || char in trigOperationRelations))
  }
  return true
}

const displayRefreshedEvent = new Event('refresh');

function refreshDisplay (valueToAdd = '', clean = false) {
  const inputDisplay = document.querySelector('input');
  if (!clean) {
    if (checkRefreshAllowed(valueToAdd)) {
      const newValue = inputDisplay.value + valueToAdd;
      inputDisplay.value = String(newValue);
      inputDisplay.dispatchEvent(displayRefreshedEvent);
    }
  } else if (valueToAdd === 'erase') {
    const newValue = inputDisplay.value === '' ? '' 
      : inputDisplay.value.at(-1) !== ' ' ? inputDisplay.value.slice(0, -1)
      : inputDisplay.value.slice(0, -3);
    inputDisplay.value = String(newValue);
    inputDisplay.dispatchEvent(displayRefreshedEvent);
  } else {
    inputDisplay.value = String(valueToAdd);
    inputDisplay.dispatchEvent(displayRefreshedEvent);
  }
}

function getDisplayValues () {
  const inputDisplay = document.querySelector('input');
  const displayValue = inputDisplay.value;
  const numbers = displayValue.split(/\s\D\s/);
  const operator = displayValue.at(displayValue.search(/\s\D\s/) + 1);
  return [numbers, operator]
}

const keyToButtonRelations = {};

const numericButtons = Array.from(document.getElementsByClassName('numerical'));
numericButtons.forEach(button => {
  button.addEventListener(
    'click',
    function() {
      refreshDisplay(this.getAttribute('data-to-display'));
    }
  );
  
  keyToButtonRelations[button.getAttribute('data-to-display')] = button;
});

const basicOperationButtons = Array.from(document.getElementsByClassName('basic'));
basicOperationButtons.forEach(button => {
  button.addEventListener(
    'click',
    function() {
      const [numbers, operator] = getDisplayValues();
      if (numbers.length === 2 && numbers.every((n) => n !== '')) {
        refreshDisplay(operate(numbers[0], operator, numbers[1]) + this.getAttribute('data-to-display'), true);
      } else if (numbers.length === 2 && numbers[1] === '') {
        refreshDisplay(`${numbers[0]} ${this.getAttribute('data-to-display')} `, true)
      } else if (numbers.length === 1 && numbers[0] !== '') {
        refreshDisplay(`${Number(numbers[0])} ${this.getAttribute('data-to-display')} `, true);
      }
    }
  );

  keyToButtonRelations[button.getAttribute('data-to-display')] = button;

});

const clearButton = document.querySelector('#clear');
clearButton.addEventListener(
  'click',
  function() {
    refreshDisplay('', true);
  }
)
keyToButtonRelations['c'] = clearButton;

const evalButton = document.querySelector('#eval');
evalButton.addEventListener(
  'click',
  function() {
    const [numbers, operator] = getDisplayValues();
    if (numbers.length === 2 && numbers.every((n) => n !== '')) {
      refreshDisplay(operate(numbers[0], operator, numbers[1]), true);
    }
  }
)
keyToButtonRelations['='] = evalButton;
keyToButtonRelations['Enter'] = evalButton;

const trigButtons = Array.from(document.getElementsByClassName('advanced'));
trigButtons.forEach(button => button.addEventListener(
  'click',
  function() {
    const [numbers, operator] = getDisplayValues();
    const trigOperator = this.innerText;
    if (numbers.length === 2 && numbers.every((n) => n !== '')) {
      refreshDisplay(operate(operate(numbers[0], operator, numbers[1]), trigOperator), true);
    } else if ((numbers.length === 2 && numbers[1] === '') || (numbers.length === 1 && numbers[0] !== '')) {
      refreshDisplay(operate(numbers[0], trigOperator), true)
    }
  }
))

const inputField = document.querySelector('input');
const scrollBar = document.querySelector('#scrollbar');
inputField.addEventListener('refresh', () => {
    const scrollBar = document.querySelector('#scrollbar');
    scrollBar.style.width = `${Math.min(inputField.clientWidth / inputField.scrollWidth * 100, 100)}%`
  }
)

inputField.addEventListener('scroll', (event) => {
  const wholeWidth = Number(window.getComputedStyle(inputField).width.slice(0, -2));
  const scrollBarWidth = Number(window.getComputedStyle(scrollBar).width.slice(0, -2));
  scrollBar.style.marginLeft = `${inputField.scrollLeft / (inputField.scrollWidth - inputField.clientWidth + scrollBarWidth) * wholeWidth}px`
})

document.addEventListener('keyup', (event) => {
  if (event.key in keyToButtonRelations) {
    keyToButtonRelations[event.key].click();
  } else if (event.key === 'Backspace') {
    refreshDisplay('erase', true);
  }
})