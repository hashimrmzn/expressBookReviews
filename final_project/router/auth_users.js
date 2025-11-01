const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// ✅ Do NOT redeclare this anywhere else
let users = [];

// Function to check if the username already exists
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Function to check if username and password match
const authenticatedUser = (username, password) => {
  const validUser = users.find(u => u.username === username && u.password === password);
  console.log("Checking login for:", username, "All users:", users); // Debug log
  return !!validUser;
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  let validUser = users.find(u => u.username === username && u.password === password);
  if (validUser) {
    let accessToken = jwt.sign({ data: username }, "access", { expiresIn: "1h" });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid login credentials" });
  }
});

// Add/modify review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review successfully added/updated" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "No review found for this user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ✅ Make sure all three exports are here:
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
