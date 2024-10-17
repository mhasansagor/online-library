const apiUrl = "https://gutendex.com/books";
const bookDetailsContainer = document.getElementById("bookDetails");

async function fetchBookDetails(bookId) {
    try {
        const response = await fetch(`${apiUrl}/${bookId}`);
        if (!response.ok) throw new Error('Book not found');
        
        const book = await response.json();

        displayBookDetails(book);
    } catch (error) {
        bookDetailsContainer.innerHTML = `<p>Error fetching book details: ${error.message}</p>`;
    }
}

function displayBookDetails(book) {
    const { title, authors, subjects, formats, id, languages, copyright, media_type, download_count, bookshelves
    } = book;
    console.log(book);
    
    bookDetailsContainer.innerHTML = `
        <h1>${title}</h1>
        <div class="book-image">
            <img src="${formats["image/jpeg"]}" alt="${title}" class="book-cover" />
        </div>
        <div class="book-detail">
            <p>ID:${id}</p>
            <h3>${authors[0]?.name || "Unknown"}</h3>
            <p>Date of Birth:${authors[0]?.birth_year || "Unknown"}</p>
            <p>Date of Death:${authors[0]?.death_year || "Unknown"}</p>
            <p>Genre: ${subjects[0] || "N/A"}</p>
            <p>Bookshelves: ${bookshelves[0]}, ${bookshelves[1]}, ${bookshelves[2]}</p>
            <p>Language: ${languages[0]}</p>
            <p>Copyright: ${copyright}</p>
            <p>Media Type: ${media_type}</p>
            <p>Total Download: ${download_count}</p>
        </div>
    `;
}

// function checkWishlist(bookId) {
//     const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
//     return wishlist.includes(String(bookId));
// }

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

if (bookId) {
    fetchBookDetails(bookId);
} else {
    bookDetailsContainer.innerHTML = "<p>No book ID provided.</p>";
}
