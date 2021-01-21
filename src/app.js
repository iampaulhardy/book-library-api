const express = require('express');
const readerControllers = require('./controllers/reader-controller');
const bookControllers = require('./controllers/book-controller')
const app = express()

app.use(express.json())

app.post('/readers', readerControllers.create);
app.get('/readers', readerControllers.list);
app.get('/readers/:id', readerControllers.getReaderById);
app.patch('/readers/:id', readerControllers.patchReaderById);
app.delete('/readers/:id', readerControllers.deleteReaderById);

app.post('/books', bookControllers.create);
app.get('/books', bookControllers.list);
app.get('/books/:id', bookControllers.getBookById);
app.patch('/books/:id', bookControllers.patchBookById);
app.delete('/books/:id', bookControllers.deleteBookById);


module.exports = app