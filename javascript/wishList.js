const wishlistBooksContainer = document.getElementById("wishlistBooks");
const paginationContainer = document.getElementById("pagination");
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let currentPage = 1;
const booksPerPage = 8;
async function fetchWishlistBooks() {
  try {
    const response = await fetch("https://gutendex.com/books");
    const data = await response.json();

    const books = data.results;
    const wishlistedBooks = books.filter((book) =>
      wishlist.includes(String(book.id))
    );
    if (wishlistedBooks.length > 0) {
      const totalPages = Math.ceil(wishlistedBooks.length / booksPerPage);
      currentPage = Math.min(currentPage, totalPages); 
      displayWishlistBooks(wishlistedBooks);
      renderPagination(wishlistedBooks.length);
    } else {
      wishlistBooksContainer.innerHTML = "<p>Your wishlist is empty.</p>";
      paginationContainer.innerHTML = "";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    wishlistBooksContainer.innerHTML = "<p>Could not load wishlist books.</p>";
  }
}

function displayWishlistBooks(books) {
  wishlistBooksContainer.innerHTML = "";

  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const paginatedBooks = books.slice(start, end);

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
    wishlistBooksContainer.appendChild(bookCard);
  });

  // ---------------------- remove from wishlist----------------------------------
  wishlistBooksContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("wishlist-icon")) {
      const bookId = event.target.getAttribute("data-id");
      removeFromWishlist(bookId);
    }
  });
}

function removeFromWishlist(bookId) {
  wishlist = wishlist.filter((id) => id !== bookId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  fetchWishlistBooks();
}
// ------------------pagination---------------------------------------------
function renderPagination(totalBooks) {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.innerText = "<<";
    prevButton.classList.add("next");
    prevButton.addEventListener("click", () => {
      currentPage--;
      fetchWishlistBooks();
    });
    paginationContainer.appendChild(prevButton);
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    pageButton.className = i === currentPage ? "active" : "";
    pageButton.addEventListener("click", () => {
      currentPage = i;
      fetchWishlistBooks();
    });
    paginationContainer.appendChild(pageButton);
  }

  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.innerText = ">>";
    nextButton.classList.add("next");
    nextButton.addEventListener("click", () => {
      currentPage++;
      fetchWishlistBooks();
    });
    paginationContainer.appendChild(nextButton);
  }
}

document.addEventListener("DOMContentLoaded", fetchWishlistBooks);
