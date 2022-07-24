const books = [];
let booksFiltered = [];
const bookShelfKey = 'BOOK_SHELF';
const DIALOG_EVENT = 'dialog-event';

const dialogDelete = document.querySelector('.dialog');
const bookDialogId = document.querySelector('#book-dialog-id');

document.addEventListener('DOMContentLoaded', function() {
  const buttonConfirm = document.querySelector('.button-confirm');
  const buttonCancel = document.querySelector('.button-cancel');
  const formSearchBook = document.querySelector('#form-search-book');
  const formInputBook = document.querySelector('#form-input-book');
  const isCompleteCheckbox = document.querySelector('#isComplete');

  buttonConfirm.addEventListener('click', function() {
    dialogDelete.style.display = 'none';
    removeBook(bookDialogId.value);
  });
  
  buttonCancel.addEventListener('click', function() {
    dialogDelete.style.display = 'none';
  });

  formSearchBook.addEventListener('submit', function(event) {
    event.preventDefault();
    const keyword = document.querySelector('#keyword-input').value;
    booksFiltered = books.filter(book => book.title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);
    renderBookData();
  });

  formInputBook.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
  });

  isCompleteCheckbox.addEventListener('change', function(){
    const isCompletedField = document.querySelector('#is-completed-field');
    const isCompleteChecked = isCompleteCheckbox.checked;
    if (isCompleteChecked) {
      isCompletedField.innerText = 'Selesai Dibaca';
    } else {
      isCompletedField.innerText = 'Belum Selesai Dibaca';
    }
  });

  dialogDelete.style.display = 'none';

  if (isSupportStorage()) {
    loadData();
  }

});

function addBook() {
  const id = generateId();
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const year = document.querySelector('#year').value;
  const isComplete = document.querySelector('#isComplete').checked;

  const book = generateObject(id, title, author, year, isComplete);
  books.unshift(book);
  saveData();
  renderBookData();
}

function renderBookData() {
  const booksCompleted = document.querySelector('#books-completed');
  const booksUncompleted = document.querySelector('#books-uncompleted');

  booksCompleted.innerHTML = '';
  booksUncompleted.innerHTML = '';

  let bookCollections = books;

  if (booksFiltered.length > 0) {
    bookCollections = booksFiltered;
  }

  for (const book of bookCollections) {
    const bookElement = renderBookItem(book);
    if (book.isComplete) {
      booksCompleted.append(bookElement);
    } else {
      booksUncompleted.append(bookElement);
    }
  }
}

function renderBookItem(book) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('book-item');

  const titleElement = document.createElement('h3');
  titleElement.innerText = book.title;

  const authorElement = document.createElement('p');
  authorElement.innerText = "Penulis: " + book.author;

  const yearElement = document.createElement('p');
  yearElement.innerText = "Tahun: " + book.year;

  const buttonSuccess = document.createElement('button');
  buttonSuccess.classList.add('button-action', 'button-green');
  if (book.isComplete) {
    buttonSuccess.innerText = 'Belum Selesai Baca';
  } else {
    buttonSuccess.innerText = 'Selesai Baca';
  }

  buttonSuccess.addEventListener('click', function() {
    setBookIsComplete(book.id);
  });

  const buttonDelete = document.createElement('button');
  buttonDelete.innerText = 'Hapus Buku';
  buttonDelete.classList.add('button-action','button-red');

  buttonDelete.addEventListener('click', function() {
    showConfirmDelete(book.id);
  });

  cardElement.append(titleElement, authorElement, yearElement, buttonSuccess, buttonDelete);

  return cardElement;
}

function showConfirmDelete(bookId) {  
  dialogDelete.style.display = 'block';
  bookDialogId.value = bookId;
}

function generateId() {
  return +new Date();
}

function generateObject(id, title, author, year, isComplete) {
  return {
    id, title, author, year, isComplete
  };
}

function setBookIsComplete(bookId) {
  const bookTarget = findBook(bookId);
  
  if (bookTarget == null) return;

  bookTarget.isComplete = !bookTarget.isComplete;
  renderBookData();
  saveData();
}

function removeBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  
  if (bookIndex == -1) return;

  books.splice(bookIndex, 1);
  renderBookData();
  saveData();
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id == bookId) {
      return book;
    }
  }

  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return -1;
}

function isSupportStorage() {
  if (typeof Storage == undefined) {
    alert("Browser Anda tidak mendukung untuk localStorage");
    return false;
  }
  return true
}

function saveData() {
  if (isSupportStorage()) {
    const parsedData = JSON.stringify(books);
    localStorage.setItem(bookShelfKey, parsedData);
  }
}

function loadData() {
  if (isSupportStorage()) {
    const booksStorage = localStorage.getItem(bookShelfKey);
    const data = JSON.parse(booksStorage);

    if (data !== null) {
      for(const book of data) {
        books.push(book);
      }
    }
  }
  renderBookData();
}
