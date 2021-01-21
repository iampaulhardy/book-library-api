const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {

    before(async () => {
        try {
            await Book.sequelize.sync();
        } catch (err) {
            console.log(err);
        }
    });

    beforeEach(async () => {
        try {
            await Book.destroy({ where: {} });
        } catch (err) {
            console.log(err)
        }
    });

    describe('POST /books', async () => {
        it('creates a new book in the database', async () => {
            const response = await request(app).post('/books').send({
                title: 'Lord of the Rings',
                author: 'JRR Tolkien',
                genre: 'Fantasy/Sci-Fi',
                ISBN: '12345'
            });
            await expect(response.status).to.equal(201);
            expect(response.body.title).to.equal('Lord of the Rings');
            const insertedBook = await Book.findByPk(response.body.id, { raw: true });
            expect(insertedBook.title).to.equal('Lord of the Rings');
            expect(insertedBook.author).to.equal('JRR Tolkien');
            expect(insertedBook.genre).to.equal('Fantasy/Sci-Fi');
            expect(insertedBook.ISBN).to.equal('12345')
        });
    });

    describe('with books in the database', () => {
        let books;
        beforeEach((done) => {
            Promise.all([
                Book.create({ title: 'To Kill a Mocking Bird', author: 'Harper Lee', genre: 'Fiction', ISBN: '67891' }),
                Book.create({ title: 'Treasure Island', author: 'Robert Louis Stevenson', genre: 'Fiction', ISBN: '12121' }),
                Book.create({ title: 'James and the Giant Peach', author: 'Roald Dahl', genre: "Children's", ISBN: '67891' }),
            ]).then((result) => {
                books = result;
                done()
            });
        });

        describe('GET /books', () => {
            it ('gets all book records', (done) => {
                request(app)
                    .get('/books')
                    .then((res) => {
                        expect(res.status).to.equal(200)
                        expect(res.body.length).to.equal(3)
                        res.body.forEach((book) => {
                            const expected = books.find((a) => a.id === book.id);
                            expect(book.title).to.equal(expected.title);
                            expect(book.author).to.equal(expected.author);
                            expect(book.genre).to.equal(expected.genre);
                            expect(book.ISBN).to.equal(expected.ISBN);
                        });
                        done();
                    });
            });
        });

        describe('GET /books/:bookId', () => {
            it ('gets book record by id', (done) => {
                const book = books[0];
                request(app)
                    .get(`/books/${book.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(200)
                        expect(res.body.title).to.equal(book.title)
                        expect(res.body.author).to.equal(book.author)
                        expect(res.body.genre).to.equal(book.genre)
                        expect(res.body.ISBN).to.equal(book.ISBN)
                        done();
                    });
            });

            it ('returns a 404 if the book does not exist', (done) => {
                request(app)
                    .get('/books/1234')
                    .then((res) => {
                        expect(res.status).to.equal(404)
                        expect(res.body.error).to.equal('The book could not be found.');
                        done();
                    });
            })
        })

        describe('PATCH /books/:id', () => {
            it ('updates book title by id', (done) => {
                const book = books[0];
                request(app)
                    .patch(`/books/${book.id}`)
                    .send({ title: 'The Da Vinci Code'})
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
                            expect(updatedBook.title).to.equal('The Da Vinci Code');
                            done();
                        })
                    })
            })

            it ('updates book author by id', (done) => {
                const book = books[0];
                request(app)
                    .patch(`/books/${book.id}`)
                    .send({ author: 'Dan Brown' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
                            expect(updatedBook.author).to.equal('Dan Brown');
                            done();
                        });
                    });
            });

            it ('updates book genre by id', (done) => {
                const book = books[0];
                request(app)
                    .patch(`/books/${book.id}`)
                    .send({ genre: 'Thriller' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
                            expect(updatedBook.genre).to.equal('Thriller');
                            done();
                        });
                    });
            });

            it ('returns a 404 if the book does not exist', (done) => {
                request(app)
                    .patch('/books/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The book could not be found.');
                        done();
                    });
            });
        })

        describe('DELETE /books/:Id', () => {
            it('deletes book by id', (done) => {
                const book = books[0];
                request(app)
                    .delete(`/books/${book.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(204);
                        Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
                            expect(updatedBook).to.equal(null);
                            done();
                        });
                    });
            });

            it('returns a 404 if the book does not exist', (done) => {
                request(app)
                    .get('/books/12345')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The book could not be found.');
                        done();
                    });
            })
        });
    })   
})