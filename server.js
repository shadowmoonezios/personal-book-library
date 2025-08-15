const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Verbindung und Fehlerbehandlung
mongoose.connect('mongodb://localhost:27017/personal-book-library', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB verbunden'))
  .catch(err => {
    console.error('MongoDB Verbindung fehlgeschlagen:', err);
    process.exit(1); // Stoppe die Anwendung bei Verbindungsfehler
  });

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
// Neue Bücher speichern
app.post('/books', (req, res) => {
  const newBook = new Book(req.body);
  newBook.save()
    .then(book => res.json(book))
    .catch(err => res.status(500).json({ error: 'Fehler beim Speichern des Buches' }));
});

// Alle Bücher abrufen
app.get('/books', (req, res) => {
  Book.find()
    .then(books => res.json(books))
    .catch(err => res.status(500).json({ error: 'Fehler beim Abrufen der Bücher' }));
});

// Buch aktualisieren
app.put('/books/:id', (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(book => {
      if (!book) {
        return res.status(404).json({ error: 'Buch nicht gefunden' });
      }
      res.json(book);
    })
    .catch(err => res.status(500).json({ error: 'Fehler beim Aktualisieren des Buches' }));
});

// Buch löschen
app.delete('/books/:id', (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(deletedBook => {
      if (!deletedBook) {
        return res.status(404).json({ error: 'Buch nicht gefunden' });
      }
      res.json({ message: 'Buch gelöscht' });
    })
    .catch(err => res.status(500).json({ error: 'Fehler beim Löschen des Buches' }));
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});