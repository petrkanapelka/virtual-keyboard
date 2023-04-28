function createTextarea() {
  const textArea = document.createElement('TEXTAREA');
  textArea.setAttribute('name', 'post');
  textArea.setAttribute('maxlength', 5000);
  textArea.setAttribute('cols', 80);
  textArea.setAttribute('rows', 5);
  textArea.setAttribute('autofocus', true);
  textArea.classList.add('textarea');
  document.querySelector('body').appendChild(textArea);
}
createTextarea();

function createKeyBoard() {
  const keyBoard = document.createElement('div');
  keyBoard.classList.add('keyboard');
  document.querySelector('body').appendChild(keyBoard);
}
createKeyBoard();

function createButton(btn) {
  const button = document.createElement('div');
  button.textContent = btn.key;
  button.code = btn.code;
  button.key = btn.key;
  button.classList.add('key');
  if (btn.key === 'Backspace' || btn.key === 'Tab' || btn.key === 'Delete' || btn.key === 'CapsLock' || btn.key === 'Enter' || btn.key === 'Ctrl' || btn.key === 'Alt' || btn.key === 'Win' || btn.keyCode === 16) {
    button.classList.add('key_black');
  }
  if (btn.code === 'ArrowUp' || btn.code === 'ArrowDown' || btn.code === 'ArrowLeft' || btn.code === 'ArrowRight') {
    button.classList.add('key_black');
  }
  if (btn.code === 'Space') {
    button.classList.add('space');
  }
  if (btn.code === 'ShiftLeft') {
    button.classList.add('shift');
  }
  const newLine = document.querySelectorAll('.row_new');
  newLine[newLine.length - 1].appendChild(button);
}
const rowOne = 'json/row1.json';
const rowTwo = 'json/row2.json';
const rowThree = 'json/row3.json';
const rowFour = 'json/row4.json';
const rowFive = 'json/row5.json';

async function getKeys(row) {
  const res = await fetch(row);
  const data = await res.json();
  const newRow = document.createElement('div');
  newRow.classList.add('row_new');
  document.querySelector('.keyboard').appendChild(newRow);
  data.forEach((button) => {
    createButton(button);
  });
}
getKeys(rowOne);
getKeys(rowTwo);
getKeys(rowThree);
getKeys(rowFour);
getKeys(rowFive);
const value = [];
let capslockIsOn = false;
function backSpace() {
  value.pop();
}
function deleteChar() {
  value.splice(value.length - 1, 1);
}
function printChar(btn) {
  value.push(btn.key);
}
function switchUpperLower(buttons) {
  if (capslockIsOn === false) {
    buttons.forEach((btn) => {
      if (btn.key.length === 1) {
        // eslint-disable-next-line no-param-reassign
        btn.textContent = btn.textContent.toUpperCase();
        // eslint-disable-next-line no-param-reassign
        btn.key = btn.key.toUpperCase();
      }
    });
    capslockIsOn = true;
  } else {
    buttons.forEach((btn) => {
      if (btn.key.length === 1) {
        // eslint-disable-next-line no-param-reassign
        btn.textContent = btn.textContent.toLowerCase();
        // eslint-disable-next-line no-param-reassign
        btn.key = btn.key.toLowerCase();
      }
    });
    capslockIsOn = false;
  }
  return capslockIsOn;
}
document.addEventListener('keydown', (event) => {
  event.preventDefault();
  const textarea = document.querySelector('textarea');
  const buttons = document.querySelectorAll('.key');
  buttons.forEach((btn) => {
    if (event.code === btn.code) {
      btn.classList.add('active');
      if (event.code === 'Backspace') {
        backSpace();
      } else if (event.code === 'Delete') {
        deleteChar();
      } else if (event.code === 'Enter') {
        value.push('\n');
      } else if (event.code === 'Tab') {
        value.push('\t');
      } else if (event.code === 'CapsLock') {
        switchUpperLower(buttons);
      } else {
        printChar(btn);
      }
      textarea.value = value.join('');
      setTimeout(() => {
        btn.classList.remove('active');
      }, 200);
    }
    return value;
  });
});
