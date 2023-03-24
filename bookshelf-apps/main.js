const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(e){
        e.preventDefault();
        addBook();
    });

    if (isStorageExist()){
        loadDataFromStorage();
    }

    
});


function addBook(){
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const yearBook = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;


    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, yearBook, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    document.getElementById('inputBookTitle').value="";
    document.getElementById('inputBookAuthor').value="";
    document.getElementById('inputBookYear').value="";
    document.getElementById('inputBookIsComplete').checked=false;
}

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted){
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function(){
    
    const unreadBookList = document.getElementById('incompleteBookshelfList');
    unreadBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    for (const bookItem of books){
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted)
        unreadBookList.append(bookElement);
        else 
         completedBookList.append(bookElement)
    }


})


function makeBook(bookObject){
    const bookName = document.createElement('h3');
    bookName.innerText = bookObject.title;

    const authorName = document.createElement('p');
    authorName.innerText= 'Penulis: ' + bookObject.author;

    const year = document.createElement('p');
    year.innerText = 'Tahun: ' + bookObject.year;   

    const button = document.createElement('div');
    button.classList.add('action');
    

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(bookName, authorName, year, button);
    container.setAttribute('id', 'book-${bookObject.id}');

    if(bookObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');

        undoButton.innerText = 'Belum Selesai Dibaca';

        undoButton.addEventListener('click', function(){
            undoBookFromCompleted(bookObject.id);
            
        });

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus buku';
        trashButton.classList.add('red');
        
        trashButton.addEventListener('click', function(){
            removeBook(bookObject.id);
            alert('Buku ' + bookObject.title + ' di Hapus')
        });
        button.append(undoButton, trashButton);
        container.append(button)
    } else {
        const doneButton = document.createElement('button');
        doneButton.innerText = 'Selesai Dibaca'
        doneButton.classList.add('green');

        doneButton.addEventListener('click', function(){
            addBookToCompleted(bookObject.id);

        });

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus buku';
        trashButton.classList.add('red');

        trashButton.addEventListener('click', function(){
            removeBook(bookObject.id);
        })   
        button.append(doneButton, trashButton);
        container.append(button)

        
    }
    

    return container;
}


function findBook(bookId){
    for (const bookItem of books){
        if (bookItem.id === bookId){
            return bookItem;
        }
    }
}


function findBookIndex(bookId){
    for (const index in books){
        if(books[index].id == bookId){
            return index;
        }
    }
}


function checkSaved(bookId){
 const bookTarget = findBook(bookId);
 if (check.clicked == true){
    bookTarget.isCompleted = true;
 }
 
}


function removeBook(bookId){
    const bookTarget = findBookIndex(bookId);

    if(bookTarget === -1) return;

    books.splice(bookTarget,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    
}


function addBookToCompleted(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY,parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}


const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist(){
    if (typeof(Storage) === undefined) {
        alert('Brower tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
    
});

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event (RENDER_EVENT));
}

document.getElementById('searchBook').addEventListener('submit', function (e) {
    e.preventDefault();
    const searchBooks = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookListTitle = document.querySelectorAll('h3');
    for (const book of bookListTitle) {
      if (book.innerText.toLowerCase().includes(searchBooks)) {
        book.parentElement.style.display = 'block';
      } else {
        book.parentElement.style.display = 'none';
      }
    }
  });

