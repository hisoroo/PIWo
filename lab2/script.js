"use strict";

// init
document.addEventListener("DOMContentLoaded", function() {
  initSeparators();
  initScrollButton();
  initSidebar();
  initDropdowns();
  initCreateListModal();
  initSearch();
});


// init logic
function initSeparators() {
  document.querySelectorAll(".tile-separator").forEach((separator) => {
    separator.addEventListener("click", handleSeparatorClick);
  });
}

function initScrollButton() {
  const scrollBtn = document.querySelector(".scroll-btn");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", toggleScrollbarVisibility);
  }
}

function toggleScrollbarVisibility() {
  const html = document.documentElement;
  const body = document.body;
  const isHidden = html.classList.contains("hide-scrollbar");

  if (isHidden) {
    html.classList.remove("hide-scrollbar");
    body.classList.remove("hide-scrollbar");
  } else {
    html.classList.add("hide-scrollbar");
    body.classList.add("hide-scrollbar");
  }
}

function initSidebar() {
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');
  const toggleImg = sidebarToggle.querySelector('img');

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    content.classList.toggle('sidebar-active');
    toggleImg.classList.toggle('rotated');
  });
}

function initDropdowns() {
  const dropdownLists = document.querySelectorAll('.dropdown-list');
  dropdownLists.forEach(dropdown => {
    const header = dropdown.querySelector('.dropdown-header');
    header.addEventListener('click', () => {
      dropdownLists.forEach(other => {
        if (other !== dropdown) {
          other.classList.remove('active');
        }
      });
      dropdown.classList.toggle('active');
    });
  });
}

function initCreateListModal() {
  const createListBtn = document.querySelector('.create-list-btn');
  const modal = document.querySelector('.modal');
  const cancelBtn = modal.querySelector('.cancel-btn');
  const confirmBtn = modal.querySelector('.confirm-btn');
  const input = modal.querySelector('.list-name-input');

  createListBtn.addEventListener('click', () => {
    modal.classList.add('active');
    input.value = '';
    input.focus();
  });

  cancelBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  confirmBtn.addEventListener('click', () => {
    const listName = input.value.trim();
    if (listName) {
      createCustomList(listName);
      modal.classList.remove('active');
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const listName = input.value.trim();
      if (listName) {
        createCustomList(listName);
        modal.classList.remove('active');
      }
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// TODOs
function handleSeparatorClick(event) {
  const separator = event.currentTarget;
  const newTile = createTile();

  const newSeparator = document.createElement("div");
  newSeparator.className = "tile-separator";
  newSeparator.innerHTML = "<span></span>";
  newSeparator.addEventListener("click", handleSeparatorClick);

  separator.parentNode.insertBefore(newTile, separator.nextSibling);
  separator.parentNode.insertBefore(newSeparator, newTile.nextSibling);

  setTimeout(() => {
    newTile.classList.add("tile-appear");
    const titleElement = newTile.querySelector(".todo-title");
    titleElement.focus();
  }, 10);
}

function createTile() {
  const newTile = document.createElement("div");
  newTile.className = "todo-tile tile-new";
  newTile.id = 'todo-' + Date.now();
  newTile.innerHTML = `
        <div class="completion-date"></div>
        <select class="todo-list-select">
            <option value="">Select a list</option>
        </select>
        <h2 class="todo-title" contenteditable="true" placeholder="Enter title..."></h2>
        <pre class="tile-content" contenteditable="true" placeholder="Enter description..."></pre>
        <button class="tile-save-btn" title="save">✓</button>
        <button class="tile-delete-btn" title="delete">×</button>
    `;

  const titleElement = newTile.querySelector(".todo-title");
  const contentElement = newTile.querySelector(".tile-content");
  const saveBtn = newTile.querySelector(".tile-save-btn");
  const deleteBtn = newTile.querySelector(".tile-delete-btn");
  const completionDate = newTile.querySelector(".completion-date");

  const listSelect = newTile.querySelector('.todo-list-select');
  updateListOptions(listSelect);

  newTile.addEventListener("dblclick", (e) => {
    if (newTile.classList.contains("tile-new")) return;

    if (
      e.target === newTile ||
      e.target === titleElement ||
      e.target === contentElement
    ) {
      newTile.classList.toggle("completed");

      if (newTile.classList.contains("completed")) {
        const now = new Date();
        const formattedDate = now.toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          weekday: "long",
          timeZone: "Europe/Warsaw",
        });
        completionDate.textContent = `Completed: ${formattedDate}`;
      } else {
        completionDate.textContent = "";
      }
    }
  });

  function cleanText(text) {
    return text
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter((line) => line.length > 0)
      .join("\n");
  }

  titleElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentElement.focus();
    }
  });

  let isSaved = false;

  saveBtn.addEventListener("click", () => {
    const rawTitle = titleElement.innerText;
    const rawContent = contentElement.innerText;
    const selectedList = listSelect.value;

    const cleanedTitle = cleanText(rawTitle);
    const cleanedContent = cleanText(rawContent);

    if (!cleanedTitle && !cleanedContent) {
      newTile.nextElementSibling?.remove();
      newTile.remove();
      return;
    }

    titleElement.textContent = cleanedTitle;
    contentElement.textContent = cleanedContent;
    titleElement.setAttribute("contenteditable", "false");
    contentElement.setAttribute("contenteditable", "false");
    newTile.classList.remove("tile-new");

    if (selectedList && !isSaved) {
      addTodoToList(newTile.id, cleanedTitle, selectedList);
      isSaved = true;
    }
  });

  deleteBtn.addEventListener("click", () => {
    const selectedList = listSelect.value;
    if (selectedList) {
      const listDropdowns = document.querySelectorAll('.dropdown-list');
      listDropdowns.forEach(dropdown => {
        if (dropdown.querySelector('.dropdown-header').textContent === selectedList) {
          const items = dropdown.querySelectorAll('.dropdown-content li');
          items.forEach(item => {
            if (item.textContent === (titleElement.textContent || 'Untitled Task')) {
              item.remove();
            }
          });
        }
      });
    }

    const deleteModal = document.querySelector('.delete-modal');
    const cancelBtn = deleteModal.querySelector('.cancel-btn');
    const confirmBtn = deleteModal.querySelector('.confirm-btn');

    const taskTitle = titleElement.textContent || 'Untitled Task';
    const taskDescription = contentElement.textContent || 'No description';

    deleteModal.querySelector('.modal-text').innerHTML = `Are you sure you want to delete the task <b>${taskTitle}</b> with the description:\n\n<b>${taskDescription}</b>`;
    deleteModal.classList.add('active');

    const handleCancel = () => {
      deleteModal.classList.remove('active');
      cleanup();
    };

    const handleConfirm = () => {
      newTile.nextElementSibling?.remove();
      newTile.remove();
      deleteModal.classList.remove('active');
      cleanup();
    };

    const handleOutsideClick = (e) => {
      if (e.target === deleteModal) {
        handleCancel();
      }
    };

    const cleanup = () => {
      cancelBtn.removeEventListener('click', handleCancel);
      confirmBtn.removeEventListener('click', handleConfirm);
      deleteModal.removeEventListener('click', handleOutsideClick);
    };

    cancelBtn.addEventListener('click', handleCancel);
    confirmBtn.addEventListener('click', handleConfirm);
    deleteModal.addEventListener('click', handleOutsideClick);
  });

  return newTile;
}

// lists
function addTodoToList(todoId, title, selectedList) {
  if (selectedList) {
    const listDropdowns = document.querySelectorAll('.dropdown-list');
    let targetDropdown;
    listDropdowns.forEach(dropdown => {
      if (dropdown.querySelector('.dropdown-header').textContent === selectedList) {
        targetDropdown = dropdown.querySelector('.dropdown-content');
      }
    });

    if (targetDropdown) {
      const listItem = document.createElement('li');
      listItem.textContent = title || 'Untitled Task';
      listItem.setAttribute('data-todo-id', todoId);
      listItem.addEventListener('click', () => {
        const todoElement = document.getElementById(listItem.getAttribute('data-todo-id'));
        if (todoElement) {
          todoElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      });
      targetDropdown.appendChild(listItem);
    }
  }
}

function updateListOptions(selectElement) {
  while (selectElement.options.length > 1) {
    selectElement.remove(1);
  }

  const lists = document.querySelectorAll('.dropdown-list .dropdown-header');
  lists.forEach(list => {
    const option = document.createElement('option');
    option.value = list.textContent;
    option.textContent = list.textContent;
    selectElement.appendChild(option);
  });
}

function createCustomList(listName) {
  const sidebarContent = document.querySelector('.sidebar-content');
  const createListBtn = document.querySelector('.create-list-btn');

  const customList = document.createElement('div');
  customList.className = 'dropdown-list';

  customList.innerHTML = `
      <div class="dropdown-header">${listName}</div>
      <ul class="dropdown-content"></ul>
  `;

  const header = customList.querySelector('.dropdown-header');
  header.addEventListener('click', () => {
    const dropdownLists = document.querySelectorAll('.dropdown-list');
    dropdownLists.forEach(other => {
      if (other !== customList) {
        other.classList.remove('active');
      }
    });
    customList.classList.toggle('active');
  });

  sidebarContent.insertBefore(customList, createListBtn);

  document.querySelectorAll('.todo-list-select').forEach(select => {
    updateListOptions(select);
  });
}

// searchbar
function initSearch() {
  const searchInput = document.querySelector('.sidebar-search');
  const caseSensitiveCheckbox = document.querySelector('.checkbox-container input[type="checkbox"]');

  searchInput.addEventListener('input', filterTasks);
  caseSensitiveCheckbox.addEventListener('change', filterTasks);
}

function filterTasks() {
  const searchInput = document.querySelector('.sidebar-search');
  const caseSensitiveCheckbox = document.querySelector('.checkbox-container input[type="checkbox"]');
  const searchTerm = searchInput.value;
  const isCaseSensitive = caseSensitiveCheckbox.checked;
  const allListItems = document.querySelectorAll('.dropdown-content li');
  const allDropdowns = document.querySelectorAll('.dropdown-list');

  if (!searchTerm) {
    allDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    allListItems.forEach(item => item.style.display = '');
    return;
  }

  const listsWithMatches = new Set();

  allListItems.forEach(item => {
    const todoId = item.getAttribute('data-todo-id');
    const todoElement = document.getElementById(todoId);

    if (!todoElement) return;

    const matches = searchForMatches(todoElement, searchTerm, isCaseSensitive);
    item.style.display = matches ? '' : 'none';

    if (matches) {
      listsWithMatches.add(item.closest('.dropdown-list'));
    }
  });

  updateDropdownVisibility(allDropdowns, listsWithMatches);
}

function searchForMatches(todoElement, searchTerm, isCaseSensitive) {
  const title = todoElement.querySelector('.todo-title').textContent;
  const content = todoElement.querySelector('.tile-content').textContent;
  const text = `${title} ${content}`;

  return isCaseSensitive
    ? text.includes(searchTerm)
    : text.toLowerCase().includes(searchTerm.toLowerCase());
}

function updateDropdownVisibility(allDropdowns, listsWithMatches) {
  allDropdowns.forEach(dropdown => {
    if (listsWithMatches.has(dropdown)) {
      dropdown.classList.add('active');
    } else {
      dropdown.classList.remove('active');
    }
  });
}
