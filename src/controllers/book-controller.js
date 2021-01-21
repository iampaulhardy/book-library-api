const { Book } = require('../models');

exports.create = (req, res) => {
    Book.create(req.body).then(book => res.status(201).json(book));
}

exports.list = (_, res) => {
    Book.findAll().then(result => { res.status(200).json(result)} );
}

exports.getBookById = (req, res) => {
    const { id } = req.params;
    Book.findByPk(id).then(result => {
        if (!result) {
            res.status(404).json({ error: 'The book could not be found.' })
        } else {
            res.status(200).json(result); 
        }
    });
}

exports.patchBookById = (req, res) => {
    const { id } = req.params;
    Book.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
        if (!rowsUpdated) {
            res.status(404).json({ error: 'The book could not be found.'})
        } else {
            res.status(200).json(rowsUpdated);
        }
    });
};

exports.deleteBookById = (req, res) => {
    const { id } = req.params;
    Book.destroy({ where: { id } }).then(result => {
        if (!result) {
            res.status(404).json({ error: 'The book could not be found.'});
        } else {
            res.status(204).json(result);
        }
    })
}