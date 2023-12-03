const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4)); 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const ISBNToFind = req.params.isbn;
    const booksByISBN= Object.values(books).filter(book=>book.ISBN===ISBNToFind);
    if (booksByISBN.length>0){
      res.send(booksByISBN);  
    }else{
        res.status(404).json({message: `Nessun libro trovato per ISBN ${ISBNToFind}`})
    }
    
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorToFind = req.params.author;
    
    // Cerca tutti i libri scritti dall'autore specificato
    const booksByAuthor = Object.values(books).filter(book => book.author === authorToFind);

    if (booksByAuthor.length > 0) {
        res.send(booksByAuthor);
    } else {
        res.status(404).json({ message: `Nessun libro trovato per l'autore ${authorToFind}` });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleToFind=req.params.title;
  const booksByTitle=Object.values(books).filter(book=>book.title===titleToFind);
  if (booksByTitle.length>0){
      res.send(booksByTitle);
  } else{
    res.status(404).json({ message: `Nessun libro trovato per titolo ${authorToFind}` });
}

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBNToFind = req.params.isbn;
    const booksByISBN = Object.values(books).find(book => book.ISBN === ISBNToFind);
    if (booksByISBN) {
        const reviews = booksByISBN.reviews || {};
        res.send(reviews);
    } else {
        res.status(404).json({ message: `Nessun libro trovato per ISBN ${ISBNToFind}` });
    }
});

module.exports.general = public_users;
