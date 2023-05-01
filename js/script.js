window.addEventListener('DOMContentLoaded', () => {
  const value = [];
  let capslockIsOn = false;
  let ctrlPress = false;
  let pressShift = 0;
  let caretPositon;
  let language;

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
    const keyboard = document.querySelector('.keyboard');
    if (keyboard.childNodes.length === 0 || btn.code === 'Tab' || btn.code === 'CapsLock' || btn.code === 'ShiftLeft' || btn.code === 'ControlLeft') {
      const newRow = document.createElement('div');
      newRow.classList.add('row_new');
      document.querySelector('.keyboard').appendChild(newRow);
    }
    const button = document.createElement('button');
    button.textContent = btn.key;
    button.code = btn.code;
    button.key = btn.key;
    button.classList.add('key');
    if (btn.key.length !== 1 || btn.keyCode === 16) {
      button.classList.add('key_black');
    }
    if (btn.keyCode <= 40 && btn.keyCode >= 37) {
      button.classList.add('key_black');
      button.classList.add('key-simple');
    }
    if (btn.code === 'Space') {
      button.classList.add('space');
    }
    if (btn.code === 'ShiftLeft') {
      button.classList.add('shift');
    }
    if (btn.key.length === 1 && btn.code !== 'Space') {
      button.classList.add('key-simple');
    }
    button.classList.add(btn.code.toLowerCase());
    const newLine = document.querySelectorAll('.row_new');
    newLine[newLine.length - 1].appendChild(button);
  }

  const engKeyboard = 'json/english-keyboard.json';
  const rusKeyboard = 'json/russian-keyboard.json';
  const engShiftKeyboard = 'json/shift-keybord-en.json';
  const rusShiftKeyboard = 'json/shift-keyboard-ru.json';

  async function getKeys(row) {
    const res = await fetch(row);
    const data = await res.json();
    data.forEach((button) => {
      createButton(button);
    });
  }

  function setInitKeyboard() {
    language = localStorage.getItem('language');
    if (language === 'en') {
      getKeys(engKeyboard);
    } else if (language === 'ru') {
      getKeys(rusKeyboard);
    } else {
      getKeys(engKeyboard);
      language = 'en';
    }
    return language;
  }

  setInitKeyboard();

  async function setKeyboard(keyboard) {
    const keys = document.querySelectorAll('.key');
    const res = await fetch(keyboard);
    const data = await res.json();
    const buttons = Array.from(keys);
    buttons.forEach((btn, indx) => {
      // eslint-disable-next-line no-param-reassign
      btn.textContent = data[indx].key;
      // eslint-disable-next-line no-param-reassign
      btn.key = data[indx].key;
    });
  }

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
          if (language === 'en') {
            while (pressShift < 1) {
              setKeyboard(engShiftKeyboard);
              setTimeout(() => {
                switchUpperLower(buttons);
              }, 60);
              pressShift += 1;
            }
          } else {
            while (pressShift < 1) {
              setKeyboard(rusShiftKeyboard);
              setTimeout(() => {
                switchUpperLower(buttons);
              }, 60);
              pressShift += 1;
            }
          }
        } else if (event.code === 'AltLeft' || event.code === 'AltRight') {
          if (ctrlPress) {
            if (language === 'en' && capslockIsOn === true) {
              setKeyboard(rusKeyboard);
              setTimeout(() => {
                switchUpperLower(buttons);
              }, 100);
              language = 'ru';
            } else if (language === 'en' && capslockIsOn !== true) {
              setKeyboard(rusKeyboard);
              language = 'ru';
            } else if (language === 'ru' && capslockIsOn === true) {
              setKeyboard(engKeyboard);
              setTimeout(() => {
                switchUpperLower(buttons);
              }, 100);
              language = 'en';
            } else {
              setKeyboard(engKeyboard);
              language = 'en';
            }
          }
        } else if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
          ctrlPress = true;
        } else if (event.code !== 'MetaLeft') {
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
          if (language === 'en') {
            setKeyboard(engKeyboard);
          } else {
            setKeyboard(rusKeyboard);
          }
          setTimeout(() => {
            switchUpperLower(buttons);
          }, 60);
          pressShift = 0;
        } else if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
          ctrlPress = false;
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
          btn.classList.toggle('active');
          switchUpperLower(buttons);
        } else if (btn.code !== 'MetaLeft' && btn.code !== 'ShiftLeft' && btn.code !== 'ShiftRight' && btn.code !== 'ControlLeft' && btn.code !== 'ControlRight' && btn.code !== 'AltLeft' && btn.code !== 'AltRight') {
          printChar(btn.key);
        }
      }
      return value;
    });
  });

  let shiftClick = false;

  document.addEventListener('click', (event) => {
    const buttons = document.querySelectorAll('.key');
    buttons.forEach((btn) => {
      const btnClick = event.composedPath().includes(btn);
      if (btnClick) {
        if (btn.code === 'ShiftLeft' || btn.code === 'ShiftRight') {
          btn.classList.toggle('active');
          if (!shiftClick) {
            if (language === 'en') {
              setKeyboard(engShiftKeyboard);
              setTimeout(() => {
                switchUpperLower(buttons);
              }, 60);
            } else {
              setKeyboard(rusShiftKeyboard);
              setTimeout(() => {
                switchUpperLower(buttons);
              }, 60);
            }
            shiftClick = true;
          } else if (shiftClick) {
            if (language === 'en') {
              setKeyboard(engKeyboard);
              setTimeout(() => {
                switchUpperLower(buttons);
              }, 60);
            } else {
              setKeyboard(rusKeyboard);
              setTimeout(() => {
                switchUpperLower(buttons);
              }, 60);
            }
            shiftClick = false;
          }
        } else if (btn.code === 'AltLeft' || btn.code === 'AltRight') {
          if (ctrlPress) {
            if (language === 'en' && capslockIsOn === true) {
              setKeyboard(rusKeyboard);
              setTimeout(() => {
                switchUpperLower(buttons);
              }, 100);
              language = 'ru';
            } else if (language === 'en' && capslockIsOn !== true) {
              setKeyboard(rusKeyboard);
              language = 'ru';
            } else if (language === 'ru' && capslockIsOn === true) {
              setKeyboard(engKeyboard);
              setTimeout(() => {
                switchUpperLower(buttons);
              }, 100);
              language = 'en';
            } else {
              setKeyboard(engKeyboard);
              language = 'en';
            }
          }
        } else if (btn.code === 'ControlLeft' || btn.code === 'ControlRight') {
          btn.classList.toggle('active');
          if (!ctrlPress) {
            ctrlPress = true;
          } else {
            ctrlPress = false;
          }
        }
      }
      return value;
    });
  });

  function setLocalStorage() {
    localStorage.setItem('language', language);
  }
  window.addEventListener('beforeunload', setLocalStorage);

  function getLocalStorage() {
    if (localStorage.getItem('language')) {
      language = localStorage.getItem('language');
    }
  }
  window.addEventListener('load', getLocalStorage);
});
