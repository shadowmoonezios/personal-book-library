import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({ title: '', author: '', year: '', genre: '' });

  useEffect(() => {
    fetch('/books')
      .then(res => res.json())
      .then(data => setBooks(data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const addBook = () => {
    fetch('/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    }).then(() => {
      setBook({ title: '', author: '', year: '', genre: '' });
      window.location.reload();
    });
  };

  return (
    <div className='App'>
      <h1>Meine Buchbibliothek</h1>
      <input name='title' value={book.title} onChange={handleInputChange} placeholder='Titel' />
      <input name='author' value={book.author} onChange={handleInputChange} placeholder='Autor' />
      <input name='year' value={book.year} onChange={handleInputChange} placeholder='Jahr' />
      <input name='genre' value={book.genre} onChange={handleInputChange} placeholder='Genre' />
      <button onClick={addBook}>Buch hinzufügen</button>
      <ul>
        {books.map(b => (<li key={b._id}>{b.title} von {b.author}</li>))}
      </ul>
    </div>
  );
}

export default App;