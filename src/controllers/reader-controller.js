const { Reader } = require('../models');

exports.create = (req, res) => {
    Reader.create(req.body).then(reader => res.status(201).json(reader));
}

exports.list = (_, res) => {
    Reader.findAll().then(result => { res.status(200).json(result)} );
}

exports.getReaderById = (req, res) => {
    const { id } = req.params;
    Reader.findByPk(id).then(result => {
        if (!result) {
            res.status(404).json({ error: 'The reader could not be found.' })
        } else {
            res.status(200).json(result); 
        }
    });
}

exports.patchReaderById = (req, res) => {
    const { id } = req.params;
    Reader.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
        if (!rowsUpdated) {
            res.status(404).json({ error: 'The reader could not be found.'})
        } else {
            res.status(200).json(rowsUpdated);
        }
    });
};

exports.deleteReaderById = (req, res) => {
    const { id } = req.params;
    Reader.destroy({ where: { id } }).then(result => {
        if (!result) {
            res.status(404).json({ error: 'The reader could not be found.'});
        } else {
            res.status(204).json(result);
        }
    })
}