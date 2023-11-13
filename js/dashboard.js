// Validar si hay un usuario activo, de lo contrario, redirigir al inicio de la aplicacion
window.addEventListener('load', () => {
  const currentUser = getCurrentUser();
  if (!currentUser) window.location.href = '/';

  getCurrentUserTasks();
  initSignOutButton();
});

const statuses = [
  'pending',
  'in-progress',
  'review',
  'done'
];

function initSignOutButton() {
  const signOutButton = document.getElementById('sign-out-link');
  signOutButton.addEventListener('click', (event) => {
    event.preventDefault();

    const agree = confirm('Confirma cerrar la sesión? Tendrá que ingresar nuevamente si desea ver su tablero.');

    if (!agree) return;

    localStorage.removeItem('teamtaskpro__currentUser');
    window.location.href = '/';
  });
}

function getCurrentUser() {
  const currentUser = localStorage.getItem('teamtaskpro__currentUser');
  return currentUser;
}

function createCard(task, index) {
  const card = document.createElement('div');
  card.classList.add('card', 'mb-2');
  card.setAttribute('data-id', task.id);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const h6 = document.createElement('h6');
  h6.classList.add('fw-bold');
  h6.innerHTML = task.title;

  const small = document.createElement('small');
  small.innerHTML = task.description;

  const metadata = document.createElement('div');
  metadata.classList.add('kanban--column-metadata');

  const metadataInfo = document.createElement('div');
  metadataInfo.classList.add('kanban--column-metadata-info');
  metadataInfo.innerHTML = `✅ TASK-${index + 1}`;

  const metadataPriority = document.createElement('span');
  metadataPriority.classList.add('kanban--column-metadata-priority');
  metadataPriority.innerHTML = task.priority;

  const metadataAvatar = document.createElement('span');
  metadataAvatar.classList.add('kanban--column-metadata-avatar');
  metadataAvatar.innerHTML = getCurrentUser().slice(0, 2).toUpperCase();

  card.appendChild(cardBody);
  cardBody.append(h6, small, metadata);
  metadata.append(metadataInfo, metadataPriority, metadataAvatar);

  return card;
}

function getCurrentUserTasks() {
  const tasks = JSON.parse(localStorage.getItem('teamtaskpro'));
  const currentUserTasks = tasks?.[getCurrentUser()] || [];
  const sortedCurrentUserTasks = currentUserTasks.sort((a, b) => a.id > b.id ? 1 : -1);

  window.tasks = sortedCurrentUserTasks;
  
  document.querySelectorAll('.counter').forEach((e) => e.innerHTML = '0');

  window.tasks.forEach((task, i) => {
    const card = createCard(task, i);

    const categoryContainer = document.getElementById(task.status);

    categoryContainer.append(card);

    const count = window.tasks.reduce((accum, el) => {
      if (task.status === el.status) {
        accum++;
      }

      return accum;
    }, 0);

    categoryContainer.closest('.kanban--column').querySelector('.counter').innerHTML = count;
  });
}

function resetColumns() {
  statuses.forEach((status) => {
    document.getElementById(status).innerHTML = null;
  });
}

const addNewItemLink = document.querySelector('.kanban--column-add-new-item-link');
const newItemForm = document.getElementById('new-item-form');
const newItemSubmitBtn = document.getElementById('new-item-submit-btn');

let modal;

addNewItemLink.addEventListener('click', (event) => {
  event.preventDefault();

  if (!modal) {
    modal = new bootstrap.Modal(document.getElementById('new-item-modal'), {
      keyboard: false,
    });
  }

  newItemForm.reset();
  modal.show();
});

newItemSubmitBtn.addEventListener('click', () => {
  const newItem = {
    id: new Date().getTime(),
    ...Object.fromEntries(new FormData(newItemForm).entries()),
    status: 'pending',
  };
  
  const currentUser = getCurrentUser();

  window.tasks = [
    ...window.tasks,
    newItem
  ];

  const teamtaskpro = JSON.parse(localStorage.getItem('teamtaskpro') || '{}');

  const newState = {
    ...teamtaskpro,
    [currentUser]: window.tasks
  };

  localStorage.setItem('teamtaskpro', JSON.stringify(newState));
  newItemForm.reset();

  resetColumns();
  getCurrentUserTasks();
});

$( function() {
  $("#pending, #in-progress, #review, #done").sortable({
    connectWith: ".tasks-container",
    receive: function(event, ui) {
      const newStatus = event.target.id;
      const taskId = ui.item.data('id');
      
      const index = window.tasks.findIndex((task) => task.id === taskId);

      if (index > -1) {
        window.tasks[index].status = newStatus;

        const teamtaskpro = JSON.parse(localStorage.getItem('teamtaskpro') || '{}');

        const newState = {
          ...teamtaskpro,
          [getCurrentUser()]: window.tasks
        };

        localStorage.setItem('teamtaskpro', JSON.stringify(newState));
      }

      resetColumns();
      getCurrentUserTasks();
    }
  }).disableSelection();
});