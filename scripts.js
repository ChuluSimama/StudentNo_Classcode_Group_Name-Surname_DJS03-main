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
  updateShowMoreButton();
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

    page = 1;
    matches = result;
    document.querySelector("[data-list-items]").innerHTML = "";
    renderBooks(matches);
    updateShowMoreButton();
}
    
  function updateShowMoreButton() { 
    const button = document.querySelector('[data-list-button]'); button.disabled = true;
   button.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
          matches.length - page * BOOKS_PER_PAGE > 0
            ? matches.length - page * BOOKS_PER_PAGE
            : 0
        })</span>
    `;
}

function setupEventListeners() {
  // Close the search overlay
  document
    .querySelector("[data-search-cancel]")
    .addEventListener("click", () => {
      document.querySelector("[data-search-overlay]").open = false;
    });

  // Close the settings overlay
  document
    .querySelector("[data-settings-cancel]")
    .addEventListener("click", () => {
      document.querySelector("[data-settings-overlay]").open = false;
    });

  // Open the search overlay
  document
    .querySelector("[data-header-search]")
    .addEventListener("click", () => {
      document.querySelector("[data-search-overlay]").open = true;
      document.querySelector("[data-search-title]").focus();
    });

  // Open the settings overlay
  document
    .querySelector("[data-header-settings]")
    .addEventListener("click", () => {
      document.querySelector("[data-settings-overlay]").open = true;
    });

  // Close the active book detail view
  document.querySelector("[data-list-close]").addEventListener("click", () => {
    document.querySelector("[data-list-active]").open = false;
  });

  // Settings form submission for theme change
  document
    .querySelector("[data-settings-form]")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const { theme } = Object.fromEntries(formData);
      setTheme(theme); // Apply the selected theme
      document.querySelector("[data-settings-overlay]").open = false; // Close the settings overlay
    });

  // Search form submission
  document
    .querySelector("[data-search-form]")
    .addEventListener("submit", handleSearch);

  // Book preview click to show book details
  document
    .querySelector("[data-list-items]")
    .addEventListener("click", () => {
      const previewPageUrl = `book-preview.html?id=${Book}`; // Create the URL for the book preview page with book ID
      window.location.href = previewPageUrl; // Navigate to the book preview page

      
      if (active) {
        // If a book is found, display its details
        document.querySelector("[data-list-active]").open = true;
        document.querySelector("[data-list-blur]").src = active.image;
        document.querySelector("[data-list-image]").src = active.image;
        document.querySelector("[data-list-title]").innerText = active.title;
        document.querySelector("[data-list-subtitle]").innerText = `${
          authors[active.author]
        } (${new Date(active.published).getFullYear()})`;
        document.querySelector("[data-list-description]").innerText =
          active.description;
      }
      return element; // Return the created element
    });
}

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
