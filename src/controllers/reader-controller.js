const { Reader } = require('../models');

exports.create = (req, res) => {
    Reader.create(req.body).then(reader => res.status(201).json(reader));
}

exports.list = (_, res) => {
    Reader.findAll().then(result => { res.status(200).json(result)} );
}

exports.getReaderById = (req, res) => {
    const { id } = req.params;
    Reader.findByPk(id).then(reader => {
        if (!reader) {
            res.status(404).json({ error: 'The reader could not be found.' })
        } else {
            res.status(200).json(reader); 
        }
    });
}

exports.patchById = (req, res) => {
    const { id } = req.params;
    Reader.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
        if (!rowsUpdated) {
            res.status(404).json({ error: 'The reader could not be found.'})
        } else {
            res.status(200).json(rowsUpdated);
        }
    });
};

exports.deleteById = (req, res) => {
    const { id } = req.params;
    Reader.destroy({ where: { id } }).then(reader => {
        if (!reader) {
            res.status(404).json({ error: 'The reader could not be found.'});
        } else {
            res.status(204).json(reader);
        }
    })
}