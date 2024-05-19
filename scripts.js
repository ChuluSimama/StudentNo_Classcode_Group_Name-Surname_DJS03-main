import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books

class Book {
  constructor({ id, title, author, image, genres, description, published }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.image = image;
    this.genres = genres;
    this.description = description;
    this.published = published;
  }
}

class Author {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class Genre {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

// Convert data into instances defined in Classes (Book, Author, and Genre).
const bookObjects = books.map((book) => new Book(book));
const authorObjects = Object.entries(authors).map(
  ([id, name]) => new Author(id, name)
);
const genreObjects = Object.entries(genres).map(
  ([id, name]) => new Genre(id, name)
);

// Initialize the application once the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", () => {
  renderBooks(matches);
  renderOptions(document.querySelector("[data-search-genres]"), genreObjects);
  renderOptions(document.querySelector("[data-search-authors]"), authorObjects);
  setupEventListeners();
  });

// Renders the list of books.
function renderBooks(bookList) {
const fragment = document.createDocumentFragment()
bookList.slice(0, BOOKS_PER_PAGE).forEach((book) => {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', book.id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${book.image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${book.title}</h3>
            <div class="preview__author">${authors[book.author]}</div>
        </div>
    `

    fragment.appendChild(element)
});

document.querySelector('[data-list-items]').appendChild(fragment);
}

// Renders options for select elements.
function renderOptions(selectElement, options) {
const fragment = document.createDocumentFragment();
const firstOption = document.createElement('option');
firstOption.value = 'any'
firstOption.innerText = 'All Options'
fragment.appendChild(firstOption);

options.forEach((option) => {
  const element = document.createElement("option");
  element.value = option.id;
  element.innerText = option.name;
  fragment.appendChild(element);
});
selectElement.appendChild(fragment);
}

// Handles the search form submission.
function handleSearch(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = bookObjects.filter((book) => {
    let genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);
    let authorMatch =
      filters.author === "any" || book.author === filters.author;
    let titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    return genreMatch && authorMatch && titleMatch;
  });
}

document.querySelector('[data-search-authors]').appendChild(authorsHtml)

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector('[data-settings-theme]').value = 'night'
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    document.querySelector('[data-settings-theme]').value = 'day'
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
})

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData);
    setTheme(theme);

    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result;
    document.querySelector("[data-list-items]").innerHTML = "";
    renderBooks(matches);

    
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element)
    }

})

// Book preview click to show book details
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break;

        const id = node?.dataset?.preview;
        for (const singleBook of bookObjects) {
          if (singleBook.id === id) {
            active = singleBook; // Set the active book
          }
        }
    }
    
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
});

function setTheme(theme) {
  if (theme === "night") {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty(
      "--color-light",
      "255, 255, 255"
    );
  }
  document.documentElement.dataset.theme = theme;
}
