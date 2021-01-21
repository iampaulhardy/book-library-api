const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');

describe('/readers', () => {

    before(async () => {
        try {
            await Reader.sequelize.sync();
        } catch (err) {
            console.log(err);
        }
    });

    beforeEach(async () => {
        try {
            await Reader.destroy({ where: {} });
        } catch (err) {
            console.log(err)
        }
    });

    describe('POST /readers', async () => {
        it('creates a new reader in the database', async () => {
            const response = await request(app).post('/readers').send({
                name: 'Paul Hardy',
                email: 'paul.hardy@abc.com',
                password: 'badpassword'
            });
            await expect(response.status).to.equal(201);
            expect(response.body.name).to.equal('Paul Hardy');
            const insertedReader = await Reader.findByPk(response.body.id, { raw: true });
            expect(insertedReader.name).to.equal('Paul Hardy');
            expect(insertedReader.email).to.equal('paul.hardy@abc.com');
            expect(insertedReader.password).to.equal('badpassword')
        });
    });

    describe('with readers in the database', () => {
        let readers;
        beforeEach((done) => {
            Promise.all([
                Reader.create({ name: 'Donald Trump', email: 'donald.trump@usa.com', password: 'password1' }),
                Reader.create({ name: 'Boris Johnson', email: 'boris.johnson@uk.com', password: 'password2' }),
                Reader.create({ name: 'Kim Jong-un', email: 'kim.jong-un@nk.com' , password: 'password3' })
            ]).then((result) => {
                readers = result;
                done()
            });
        });

        describe('GET /readers', () => {
            it ('gets all reader records', (done) => {
                request(app)
                    .get('/readers')
                    .then((res) => {
                        expect(res.status).to.equal(200)
                        expect(res.body.length).to.equal(3)
                        res.body.forEach((reader) => {
                            const expected = readers.find((a) => a.id === reader.id);
                            expect(reader.name).to.equal(expected.name);
                            expect(reader.email).to.equal(expected.email);
                            expect(reader.password).to.equal(expected.password);
                        });
                        done();
                    });
            });
        });

        describe('GET /readers/:readerId', () => {
            it ('gets reader record by id', (done) => {
                const reader = readers[0];
                request(app)
                    .get(`/readers/${reader.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(200)
                        expect(res.body.name).to.equal(reader.name)
                        expect(res.body.email).to.equal(reader.email)
                        expect(res.body.password).to.equal(reader.password)
                        done();
                    });
            });

            it ('returns a 404 if the reader does not exist', (done) => {
                request(app)
                    .get('/readers/1234')
                    .then((res) => {
                        expect(res.status).to.equal(404)
                        expect(res.body.error).to.equal('The reader could not be found.');
                        done();
                    });
            })
        })

        describe('PATCH /readers/:id', () => {
            it ('updates reader name by id', (done) => {
                const reader = readers[0];
                request(app)
                    .patch(`/readers/${reader.id}`)
                    .send({ name: 'Margret Thatcher'})
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
                            expect(updatedReader.name).to.equal('Margret Thatcher');
                            done();
                        })
                    })
            })

            it ('updates reader email by id', (done) => {
                const reader = readers[0];
                request(app)
                    .patch(`/readers/${reader.id}`)
                    .send({ email: 'margret.thatcher@uk.com' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
                            expect(updatedReader.email).to.equal('margret.thatcher@uk.com');
                            done();
                        });
                    });
            });

            it ('updates reader password by id', (done) => {
                const reader = readers[0];
                request(app)
                    .patch(`/readers/${reader.id}`)
                    .send({ password: 'goodpassword' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
                            expect(updatedReader.password).to.equal('goodpassword');
                            done();
                        });
                    });
            });

            it ('returns a 404 if the reader does not exist', (done) => {
                request(app)
                    .patch('/readers/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The reader could not be found.');
                        done();
                    });
            });
        })

        describe('DELETE /reader/:Id', () => {
            it('deletes reader by id', (done) => {
                const reader = readers[0];
                request(app)
                    .delete(`/readers/${reader.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(204);
                        Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
                            expect(updatedReader).to.equal(null);
                            done();
                        });
                    });
            });

            it('returns a 404 if the reader does not exist', (done) => {
                request(app)
                    .get('/readers/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The reader could not be found.');
                        done();
                    });
            })
        });
    })   
})