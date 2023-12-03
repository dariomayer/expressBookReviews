const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const ISBNToFind = req.params.isbn;
    const booksByISBN = Object.values(books).find(book => book.ISBN === ISBNToFind);

    if (booksByISBN) {
        const reviews = booksByISBN.reviews || {};
        const username = req.session.authorization && req.session.authorization.username;

        if (username) {
            const userReview = req.body.review;

            if (userReview) {
                // Se lo stesso utente ha già inserito una recensione, modificala
                if (reviews[username]) {
                    reviews[username] = userReview;
                    res.send({ message: `Recensione modificata da ${username}` });
                } else {
                    // Aggiungi una nuova recensione per un nuovo utente
                    reviews[username] = userReview;
                    res.send({ message: `Nuova recensione aggiunta da ${username}` });
                }
            } else {
                res.status(400).json({ message: "Review non fornita" });
            }
        } else {
            res.status(403).json({ message: "Utente non autenticato" });
        }
    } else {
        res.status(404).json({ message: `Nessun libro trovato per ISBN ${ISBNToFind}` });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBNToFind = req.params.isbn;
    const booksByISBN = Object.values(books).find(book => book.ISBN === ISBNToFind);

    if (booksByISBN) {
        const reviews = booksByISBN.reviews || {};
        const username = req.session.authorization && req.session.authorization.username;

        if (username) {
            const userReview = req.body.review;

            if (userReview) {
                // Se lo stesso utente ha già inserito una recensione, modificala
                if (reviews[username]) {
                    delete reviews[username]
                    res.send({ message: `Recensione eliminata da ${username}` });
                } else {
                    res.send({ message: `Nessuna recensione da rimuovere per l'utente ${username}` });
                }
            } else {
                res.status(403).json({ message: "utente non autorizzato alla rimozione" });
            }
        } else {
            res.status(403).json({ message: "Utente non autenticato" });
        }
    } else {
        res.status(404).json({ message: `Nessun libro trovato per ISBN ${ISBNToFind}` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
