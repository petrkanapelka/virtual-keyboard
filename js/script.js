function createTextarea() {
  const textArea = document.createElement('TEXTAREA');
  textArea.setAttribute('name', 'post');
  textArea.setAttribute('maxlength', 5000);
  textArea.setAttribute('cols', 80);
  textArea.setAttribute('rows', 5);
  textArea.classList.add('textarea');
  //  const button = document.createElement('BUTTON');
  document.querySelector('body').appendChild(textArea);
}
createTextarea();
