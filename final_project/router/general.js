const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4)); 
});

// Get the book list using async-await
public_users.get('/async', async function (req, res) {
    try {
        const bookList = books;
        res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        console.error('Errore durante il recupero dell\'elenco dei libri:', error);
        res.status(500).json({ message: 'Errore durante il recupero dell\'elenco dei libri' });
    }
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

public_users.get('/isbn-async/:isbn', async function (req, res) {
    try {
        const ISBNToFind = req.params.isbn;
        
        // Simula una chiamata asincrona per ottenere i dettagli del libro dall'oggetto 'books'
        const bookDetails = Object.values(books).find(book => book.ISBN === ISBNToFind);

        if (bookDetails) {
            res.send(bookDetails);
        } else {
            res.status(404).json({ message: `Nessun libro trovato per ISBN ${ISBNToFind}` });
        }
    } catch (error) {
        console.error('Errore durante il recupero dei dettagli del libro:', error);
        res.status(500).json({ message: 'Errore durante il recupero dei dettagli del libro' });
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

// Get book details based on author using async-await
public_users.get('/author-async/:author', async function (req, res) {
    try {
        const authorToFind = req.params.author;

        // Simula una chiamata asincrona per ottenere i libri scritti dall'autore specificato
        const booksByAuthor = Object.values(books).filter(book => book.author === authorToFind);

        if (booksByAuthor.length > 0) {
            res.send(booksByAuthor);
        } else {
            res.status(404).json({ message: `Nessun libro trovato per l'autore ${authorToFind}` });
        }
    } catch (error) {
        console.error('Errore durante il recupero dei libri dell\'autore:', error);
        res.status(500).json({ message: 'Errore durante il recupero dei libri dell\'autore' });
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

// Get book details based on title using async-await
public_users.get('/title-async/:title', async function (req, res) {
    try {
        const titleToFind = req.params.title;

        // Simula una chiamata asincrona per ottenere i libri con il titolo specificato
        const booksByTitle = Object.values(books).filter(book => book.title === titleToFind);

        if (booksByTitle.length > 0) {
            res.send(booksByTitle);
        } else {
            res.status(404).json({ message: `Nessun libro trovato per il titolo ${titleToFind}` });
        }
    } catch (error) {
        console.error('Errore durante il recupero dei libri per titolo:', error);
        res.status(500).json({ message: 'Errore durante il recupero dei libri per titolo' });
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
