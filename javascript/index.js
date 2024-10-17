const url = "https://gutendex.com/books";
const bookList = document.getElementById("bookList");
const pagination = document.getElementById("pagination");
const searchBar = document.getElementById("searchBar");
const genreFilter = document.getElementById("genreFilter");

let books = [];
let currentPage = 1;
let booksPerPage = 8;
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

async function fetchBooks(batchSize, delay) {
  try {
    const response = await fetch("https://gutendex.com/books");
    const data = await response.json();

    books = data.results;
    displayBooks();
    populateGenres();
    for (let i = 0; i < books.length; i += batchSize) {
      if (i + batchSize < books.length) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchBooks(url, 8, 1000);
// --------------display books---------------------------
function displayBooks() {
  bookList.innerHTML = "";
  const filteredBooks = filterBooks();
  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const paginatedBooks = filteredBooks.slice(start, end);

  paginatedBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.onclick = () => {
      location.href = `book.html?id=${book.id}`;
    };
    bookCard.innerHTML = `
            <div class="book-image">
              <img src="${book.formats["image/jpeg"]}" alt="${book.title}" />
            </div>
            <div class="book-detail">
              <h3>${book.title}</h3>
              <p>Author: ${book.authors[0]?.name || "Unknown"}</p>
              <p>Genre: ${book.subjects[0] || "N/A"}</p>
              <p>ID: ${book.id}</p>
            </div>
            <span class="wishlist-icon" data-id="${book.id}">
                ${wishlist.includes(book.id) ? "❤️" : "🤍"}
            </span>
        `;
    bookList.appendChild(bookCard);
  });

  renderPagination(filteredBooks.length);
}

// --------------display books---------------------------
  
// ----------------------wish List------------------------------
bookList.addEventListener("click", (e) => {
  if (e.target.classList.contains("wishlist-icon")) {
    const bookId = e.target.getAttribute("data-id");
    if (wishlist.includes(bookId)) {
      wishlist = wishlist.filter((id) => id !== bookId);
      e.target.innerText = "🤍";
    } else {
      wishlist.push(bookId);
      e.target.innerText = "❤️";
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
});

// ----------------------wish List------------------------------

// ---------------------search---------------------------------
showBook.addEventListener("click", displayBooks);
genreFilter.addEventListener("change", displayBooks);

function filterBooks() {
  const searchTerm = searchBar.value.toLowerCase();
  const selectedGenre = genreFilter.value;
  return books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(searchTerm);
    const matchesGenre = selectedGenre
      ? book.subjects.includes(selectedGenre)
      : true;
    return matchesTitle && matchesGenre;
  });
}

// ---------------------search---------------------------------

// --------------------------pagination--------------------------------------
function renderPagination(totalBooks) {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.innerText = "<<";
    prevButton.classList.add("previous");
    prevButton.addEventListener("click", () => {
      currentPage--;
      displayBooks();
    });
    pagination.appendChild(prevButton);
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    pageButton.className = i === currentPage ? "active" : "";
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayBooks();
    });
    pagination.appendChild(pageButton);
  }

  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.innerText = ">>";
    nextButton.classList.add("next");
    nextButton.addEventListener("click", () => {
      currentPage++;
      displayBooks();
    });
    pagination.appendChild(nextButton);
  }
}

// --------------------------pagination--------------------------------------

// ------------------------genre dropdown-----------------------------------
function populateGenres() {
  const genres = new Set();
  books.forEach((book) =>
    book.subjects.forEach((subject) => genres.add(subject))
  );
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.innerText = genre;
    genreFilter.appendChild(option);
  });
}

// ------------------------genre dropdown-----------------------------------

document.addEventListener("DOMContentLoaded", fetchBooks);
