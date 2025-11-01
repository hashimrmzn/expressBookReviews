const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
let isValid = require("./auth_users.js").isValid;

const public_users = express.Router();

// 📘 1. Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  console.log("User registered:", users); // Debug check
  return res.status(200).json({ message: "User registered successfully!" });
});



//  2. Get the book list available in the shop
public_users.get('/', (req, res) => {
    return res.status(200).send(JSON.stringify(books, null, 4));
});


//  3. Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


//  4. Get book details based on author
public_users.get('/author/:author', (req, res) => {
   const author = req.params.author;
  let matchingBooks = [];

  // Iterate through all books
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});


//  5. Get all books based on title
public_users.get('/title/:title', (req, res) => {
 const title = req.params.title;
  let matchingBooks = [];

  // Iterate through all books
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});


//  6. Get book reviews
public_users.get('/review/:isbn', (req, res) => {
 const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});



// Task 10: Get all books using Async/Await
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json({
      message: "Fetched books using Async/Await",
      data: response.data
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});



// Task 11: Get book details by ISBN using Promises
public_users.get('/promise/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      return res.status(200).json({
        message: "Fetched book details using Promises",
        data: response.data
      });
    })
    .catch(error => {
      return res.status(500).json({ message: "Error fetching book details", error: error.message });
    });
});


// Task 12: Get books by Author using Promises
public_users.get('/promise/author/:author', (req, res) => {
  const { author } = req.params;

  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => {
      return res.status(200).json({
        message: "Fetched books by author using Promises",
        data: response.data
      });
    })
    .catch(error => {
      return res.status(500).json({ message: "Error fetching author data", error: error.message });
    });
});



// Task 13: Get books by Title using Async/Await
public_users.get('/async/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json({
      message: "Fetched books by title using Async/Await",
      data: response.data
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching title data", error: error.message });
  }
});



module.exports.general = public_users;
