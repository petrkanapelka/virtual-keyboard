function createTextarea() {
  const textArea = document.createElement('TEXTAREA');
  textArea.setAttribute('name', 'post');
  textArea.setAttribute('maxlength', 5000);
  textArea.setAttribute('cols', 80);
  textArea.setAttribute('rows', 5);
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
  button.classList.add('key');
  if (btn.key === 'Backspace' || btn.key === 'Tab' || btn.key === 'Delete') {
    button.classList.add('key_black');
  }
  const newLine = document.querySelectorAll('.row_new');
  newLine[newLine.length - 1].appendChild(button);
}
const rowOne = 'json/row1.json';
const rowTwo = 'json/row2.json';
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
