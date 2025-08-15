const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Verbindung
mongoose.connect('mongodb://localhost:27017/personal-book-library', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB verbunden'))
  .catch(err => console.log(err));

// Buch Schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
  genre: String
});

// Buch Modell
const Book = mongoose.model('Book', bookSchema);

// Routen
app.post('/books', (req, res) => {
  const newBook = new Book(req.body);
  newBook.save().then(book => res.json(book));
});

app.get('/books', (req, res) => {
  Book.find().then(books => res.json(books));
});

app.put('/books/:id', (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(book => res.json(book));
});

app.delete('/books/:id', (req, res) => {
  Book.findByIdAndDelete(req.params.id).then(() => res.json({ message: 'Buch gelöscht' }));
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});