const types = [
  'proyectos',
  'tareas',
  'actividades',
  'ideas'
];

let currentTypeIndex = 1;

function initTextAnimation() {
  const typeElement = document.getElementById('type');

  typeElement.innerHTML = types[0];

  setInterval(() => {
    if (!types[currentTypeIndex]) currentTypeIndex = 0;

    typeElement.innerHTML = types[currentTypeIndex];

    currentTypeIndex++;
  }, 2000);
}

let signInModal;

const startButtonsCallback = (event) => {
  event.preventDefault();

  if (!signInModal) {
    signInModal = new bootstrap.Modal(document.getElementById('start-now-modal'), {
      keyboard: false,
    });
  }

  signInModal.show();
};

function initStartButtons() {
  const signInButton = document.getElementById('sign-in-link');
  const startNowButton = document.getElementById('start-now-button');

  signInButton.addEventListener('click', startButtonsCallback);
  startNowButton.addEventListener('click', startButtonsCallback);
}

function initSignInButton() {
  /** @type {HTMLFormElement} startNowForm */
  const startNowForm = document.getElementById('start-now-modal-form');
  const startNowModalButton = document.getElementById('start-now-modal-button');
  const startNowModalEmail = startNowForm.querySelector('input');
  startNowModalButton.addEventListener('click', () => {
    if (!startNowForm.checkValidity()) return;

    localStorage.setItem('teamtaskpro__currentUser', startNowModalEmail.value);

    window.location.href = '/dashboard';
  });
}

window.addEventListener('load', () => {
  initTextAnimation();
  initStartButtons();
  initSignInButton();
});