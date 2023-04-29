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

const textarea = document.querySelector('textarea');
textarea.addEventListener('blur', () => {
  textarea.focus();
});

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
  if (btn.key.length !== 1 || btn.keyCode === 16) {
    button.classList.add('key_black');
  }
  if (btn.keyCode <= 40 && btn.keyCode >= 37) {
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
const rowTwoRu = 'json/row2ru.json';
const rowThree = 'json/row3.json';
const rowThreeRU = 'json/row3ru.json';
const rowFour = 'json/row4.json';
const rowFourRu = 'json/row4ru.json';
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

function setEngKeyboard() {
  getKeys(rowOne);
  getKeys(rowTwo);
  getKeys(rowThree);
  getKeys(rowFour);
  getKeys(rowFive);
}
async function setLangKeyboard(index, rowRu) {
  const rows = document.querySelectorAll('.row_new');
  const res = await fetch(rowRu);
  const data = await res.json();
  const ruLang = Array.from(rows[index].children);
  ruLang.forEach((btn, indx) => {
    // eslint-disable-next-line no-param-reassign
    btn.textContent = data[indx].key;
    // eslint-disable-next-line no-param-reassign
    btn.key = data[indx].key;
  });
}
setEngKeyboard();

const value = [];
let capslockIsOn = false;
let caretPositon;
let english = true;

function changeText() {
  textarea.value = value.join('');
  textarea.selectionStart = caretPositon;
  textarea.selectionEnd = textarea.selectionStart;
}
function getCaretPositon(input) {
  if (input.setSelectionRange) {
    caretPositon = input.selectionStart;
  }
  return caretPositon;
}
getCaretPositon(textarea);

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

function printChar(char) {
  value.splice(caretPositon, 0, char);
  caretPositon += 1;
  changeText();
}

function deleteChar() {
  value.splice(caretPositon, 1);
  changeText();
}

function backSpace() {
  value.splice(caretPositon - 1, 1);
  caretPositon -= 1;
  changeText();
}
let shiftPress = false;
document.addEventListener('keydown', (event) => {
  event.preventDefault();
  textarea.setAttribute('autofocus', true);
  const buttons = document.querySelectorAll('.key');
  buttons.forEach((btn) => {
    if (event.code === btn.code) {
      btn.classList.add('active');
      if (event.code === 'Backspace') {
        if (caretPositon !== 0) {
          backSpace();
        }
      } else if (event.code === 'Delete') {
        deleteChar();
      } else if (event.code === 'Enter') {
        printChar('\n');
      } else if (event.code === 'Tab') {
        printChar('\t');
      } else if (event.code === 'CapsLock') {
        switchUpperLower(buttons);
      } else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        shiftPress = true;
        switchUpperLower(buttons);
      } else if (event.code === 'AltLeft' || event.code === 'AltRight') {
        if (shiftPress) {
          if (english) {
            setLangKeyboard(1, rowTwoRu);
            setLangKeyboard(2, rowThreeRU);
            setLangKeyboard(3, rowFourRu);
            english = false;
          } else {
            setLangKeyboard(1, rowTwo);
            setLangKeyboard(2, rowThree);
            setLangKeyboard(3, rowFour);
            english = true;
          }
        }
      } else if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
        console.log('ctrl');
      } else {
        printChar(btn.key);
      }
    }
    return value;
  });
});
document.addEventListener('keyup', (event) => {
  event.preventDefault();
  textarea.setAttribute('autofocus', true);
  const buttons = document.querySelectorAll('.key');
  buttons.forEach((btn) => {
    if (event.code === btn.code) {
      btn.classList.remove('active');
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        switchUpperLower(buttons);
        shiftPress = false;
      }
    }
  });
});

document.addEventListener('click', (event) => {
  getCaretPositon(textarea);
  event.preventDefault();
  textarea.setAttribute('autofocus', true);
  const buttons = document.querySelectorAll('.key');
  buttons.forEach((btn) => {
    const btnClick = event.composedPath().includes(btn);
    if (btnClick) {
      if (btn.code === 'Backspace') {
        if (caretPositon !== 0) {
          backSpace();
        }
      } else if (btn.code === 'Delete') {
        deleteChar();
      } else if (btn.code === 'Enter') {
        printChar('\n');
      } else if (btn.code === 'Tab') {
        printChar('\t');
      } else if (btn.code === 'CapsLock') {
        switchUpperLower(buttons);
      } else if (btn.keyCode === 16) {
        setLangKeyboard();
      } else {
        printChar(btn.key);
      }
    }
    return value;
  });
});
