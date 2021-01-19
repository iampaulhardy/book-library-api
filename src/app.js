const express = require('express');
const readerControllers = require('./controllers/reader-controller');
const app = express()

app.use(express.json())

app.post('/readers', readerControllers.create);
app.get('/readers', readerControllers.list);
app.get('/readers/:id', readerControllers.getReaderById);
app.patch('/readers/:id', readerControllers.patchById);
app.delete('/readers/:id', readerControllers.deleteById);

module.exports = app